import { keymap, EditorView } from '@codemirror/view';
import { EditorSelection, EditorState } from '@codemirror/state';
import { TablePreviewWidget } from '@/features/widgets';
import { markdownLivePreviewField } from '@/features/plugins';
import { getTableRange } from '@/lib/client/markdown/markdown-table-utils';

export const tableBackspace = keymap.of([
  {
    key: 'Backspace',
    run(view: EditorView) {
      const { state } = view;
      const { main } = state.selection;
      const decoSet = state.field(markdownLivePreviewField, false);
      if (!decoSet) return false;

      if (!main.empty) {
        let isTableSelection = false;
        decoSet.between(main.from, main.to, (f, t, deco) => {
          if (deco.spec.widget instanceof TablePreviewWidget && f >= main.from && t <= main.to) isTableSelection = true;
        });

        if (isTableSelection) {
          view.dispatch({
            changes: { from: main.from, to: main.to, insert: '' },
            selection: { anchor: main.from },
          });
          return true;
        }
        return false;
      }

      const line = state.doc.lineAt(main.head);
      if (main.head !== line.from || line.number === 1) return false;

      const prevPos = main.head - 1;
      let tableRange: { from: number; to: number } | null = null;

      decoSet.between(prevPos, prevPos, (from, to, deco) => {
        if (deco.spec.widget instanceof TablePreviewWidget) tableRange = { from, to };
      });

      if (tableRange) {
        const range = tableRange as { from: number; to: number };
        view.dispatch({
          selection: EditorSelection.range(range.to, range.from),
          scrollIntoView: true,
        });
        return true;
      }
      return false;
    },
  },
]);

export const tableKeyboardHandler = EditorView.domEventHandlers({
  keydown: (event, view) => {
    const isUp = event.key === 'ArrowUp';
    const isDown = event.key === 'ArrowDown';
    if (!isUp && !isDown) return false;

    if ((event.target as HTMLElement).closest('.cm-table-cell-editor')) return false;

    const { state } = view;
    const sel = state.selection.main;
    const currentLine = state.doc.lineAt(sel.head);
    const tables = getAllTableRanges(state);

    for (const { from, to } of tables) {
      const tableStartLine = state.doc.lineAt(from).number;
      const tableEndLine = state.doc.lineAt(to).number;

      // --- BOUNDARY DETECTION ---
      const atTopBoundary = currentLine.number === tableStartLine - 1;
      const atBottomBoundary = currentLine.number === tableEndLine + 1;

      if (event.shiftKey) {
        if (isDown && atTopBoundary) {
          event.preventDefault();
          const nextLineNum = Math.min(state.doc.lines, tableEndLine + 1);
          const nextLine = state.doc.line(nextLineNum);

          view.dispatch({
            selection: EditorSelection.range(sel.anchor, nextLine.from),
            scrollIntoView: true,
          });
          return true;
        }
        if (isUp && atBottomBoundary) {
          event.preventDefault();

          const prevLineNum = Math.max(1, tableStartLine - 1);
          const prevLine = state.doc.line(prevLineNum);

          view.dispatch({
            selection: event.shiftKey ? EditorSelection.range(sel.anchor, prevLine.from) : EditorSelection.cursor(prevLine.from),
            scrollIntoView: true,
          });
          return true;
        }
      } else {
        // not needed cm will handle isDown
        // if (isDown && atTopBoundary) {
        //   event.preventDefault();

        //   const container = view.dom.querySelector(`.cm-table-widget-container[data-from="${from}"][data-to="${to}"]`) as HTMLElement | null;

        //   const firstCell = container?.querySelector('tr:nth-child(1) :is(td, th):nth-child(1) .cm-table-cell-editor') as HTMLElement | null;

        //   firstCell?.focus();
        //   return true;
        // }
        if (isUp && atBottomBoundary) {
          event.preventDefault();

          const container = view.dom.querySelector(`.cm-table-widget-container[data-from="${from}"][data-to="${to}"]`) as HTMLElement | null;

          const rows = container?.querySelectorAll('tr');
          const lastRow = rows?.[rows.length - 1];

          const firstCell = lastRow?.querySelector(':is(td, th):nth-child(1) .cm-table-cell-editor') as HTMLElement | null;

          firstCell?.focus();
          return true;
        }
      }
    }
    return false;
  },
});

function getAllTableRanges(state: EditorState) {
  const ranges: { from: number; to: number }[] = [];
  for (let i = 1; i <= state.doc.lines; i++) {
    const line = state.doc.line(i);
    if (line.text.trim().startsWith('|')) {
      const range = getTableRange(state, i);
      ranges.push({
        from: state.doc.line(range.start).from,
        to: state.doc.line(range.end).to,
      });
      i = range.end;
    }
  }
  return ranges;
}
