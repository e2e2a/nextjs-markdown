import { EditorView, Decoration, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { StateField, RangeSet, EditorState, StateEffect, Transaction, Extension, ChangeSpec } from '@codemirror/state';

import { TablePreviewWidget } from '../widgets';
import { buildDecorations } from '../editor/decorations';

export const setColumnSelection = StateEffect.define<{ from: number; col: number | null }>();
export const columnSelectionField = StateField.define<{ from: number; col: number | null } | null>({
  create() {
    return null;
  },
  update(value, tr) {
    for (const e of tr.effects) {
      if (e.is(setColumnSelection)) return e.value;
    }
    if (tr.docChanged) return null;
    return value;
  },
});

// ------------------------------
// Main StateField
// ------------------------------
export const markdownLivePreviewField = StateField.define<RangeSet<Decoration>>({
  create(state: EditorState) {
    return buildDecorations(state);
  },
  update(decos, tr) {
    if (tr.docChanged || tr.selection) {
      return buildDecorations(tr.state);
    }
    return decos.map(tr.changes);
  },
  provide: f => EditorView.decorations.from(f),
});

export const tableSelectionHighlighter = ViewPlugin.fromClass(
  class {
    constructor(readonly view: EditorView) {
      this.sync();
    }
    update(update: ViewUpdate) {
      if (update.selectionSet || update.docChanged || update.viewportChanged) {
        requestAnimationFrame(() => this.sync());
      }
    }
    sync() {
      const sel = this.view.state.selection.main;
      const isEditingAnyCell = document.activeElement?.closest('.cm-table-cell-editor');

      this.view.dom.querySelectorAll<HTMLElement & { __widget?: TablePreviewWidget }>('.cm-table-widget-container').forEach(container => {
        const from = parseInt(container.getAttribute('data-from') || '0');
        const to = parseInt(container.getAttribute('data-to') || '0');
        const table = container.querySelector('.cm-interactive-table');

        const isInside = !isEditingAnyCell && !sel.empty && sel.from < to && sel.to > from;

        table?.classList.toggle('is-selected', isInside);

        if (!isInside) {
          container.querySelectorAll('.cm-table-col-selected').forEach(el => el.classList.remove('cm-table-col-selected'));

          table?.classList.remove('has-selection');

          const widget = container.__widget;
          if (widget && widget.selectedColumn !== null) {
            widget.selectedColumn = null;
          }
        }
      });
    }
  }
);

export const tableSpacingManager: Extension = EditorState.transactionFilter.of(tr => {
  if (!tr.docChanged || tr.annotation(Transaction.userEvent) === 'layout.spacing') return tr;

  const changes: ChangeSpec[] = [];
  tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
    const text = inserted.toString();
    if (!text) return;

    const line = tr.startState.doc.lineAt(fromA);
    const nextLineText = tr.startState.doc.line(Math.min(line.number + 1, tr.startState.doc.lines)).text;
    const prevLineText = tr.startState.doc.line(Math.max(line.number - 1, 1)).text;

    if (nextLineText.trim().startsWith('|')) changes.push({ from: toB, insert: '\n' });
    if (prevLineText.trim().startsWith('|')) changes.push({ from: fromB, insert: '\n' });
  });

  if (changes.length === 0) return tr;

  return [
    tr,
    {
      changes,
      annotations: Transaction.userEvent.of('layout.spacing'),
    },
  ];
});
