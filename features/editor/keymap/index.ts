import { keymap, EditorView, Command } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';
import { TablePreviewWidget } from '@/features/editor/widgets';
import { markdownLivePreviewField } from '@/features/editor/plugins';
import { getAllTableRanges } from '@/lib/client/markdown/markdown-table-utils';
import { autocompletion, Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { useNodeStore } from '../stores/nodes';
import { flattenNodeTree } from '@/utils/client/node-utils';
import { useTabStore } from '../stores/tabs';
import { INode } from '@/types';

/** Start Internal Link helper */
let cachedFlatNodes: INode[] = [];
const cachedSearchIndex: Map<string, string> = new Map();
export function rebuildNodeCache(nodes: INode[]) {
  const flat = flattenNodeTree(nodes);

  cachedFlatNodes = flat;

  cachedSearchIndex.clear();

  for (const n of flat) {
    cachedSearchIndex.set(n._id, `${n.title} ${n.path ?? ''}`.toLowerCase());
  }
}

/**
 * Subscribe to Zustand changes
 */
// rebuild initially
rebuildNodeCache(useNodeStore.getState().nodes ?? []);

// subscribe to changes
useNodeStore.subscribe(() => {
  const nodes = useNodeStore.getState().nodes;
  if (!nodes) return;

  rebuildNodeCache(nodes);
});

interface LinkCompletion extends Completion {
  type: 'file' | 'folder';
  parentId?: string | null;
  title: string;
}

function getRelativePath(from: string, to: string) {
  if (!from) return to;

  const fromParts = from.split('/');
  const toParts = to.split('/');

  // remove filename from current file
  fromParts.pop();

  while (fromParts.length && toParts.length && fromParts[0] === toParts[0]) {
    fromParts.shift();
    toParts.shift();
  }

  const up = fromParts.map(() => '..');
  const result = [...up, ...toParts].join('/');

  return result || './';
}

function resolveRelativePath(currentPath: string, relativePath: string) {
  const currentParts = currentPath.split('/');
  currentParts.pop();

  const parts = relativePath.split('/');

  for (const part of parts) {
    if (part === '..') {
      currentParts.pop();
    } else if (part === '.' || part === '') {
      continue;
    } else {
      currentParts.push(part);
    }
  }

  return currentParts.join('/');
}
/** End Internal Link helper */

export const selectAllToTop: Command = view => {
  view.dispatch({
    selection: EditorSelection.single(0, view.state.doc.length),
  });
  return true;
};

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
          const container = view.dom.querySelector(`.cm-table-widget-container[data-from="${from}"][data-to="${to}"]`) as HTMLElement | null;
          if (!container) continue;
          event.preventDefault();
          const rows = container?.querySelectorAll('tr');
          const lastRow = rows?.[rows.length - 1];

          const firstCell = lastRow?.querySelector(':is(td, th):nth-child(1) .cm-table-cell-editor') as HTMLElement | null;

          if (firstCell) {
            firstCell.focus();
            return true;
          }
        }
      }
    }
    return false;
  },
});

export const internalLinkCompletion = autocompletion({
  activateOnTyping: true,
  activateOnTypingDelay: 60,

  override: [
    (context: CompletionContext): CompletionResult | null => {
      const word = context.matchBefore(/\[\[[^\]]*/);
      if (!word) return null;

      const typed = word.text.slice(2).toLowerCase();

      const state = useNodeStore.getState();
      const currentNode = state.activeNode;

      const options: LinkCompletion[] = [];

      for (const n of cachedFlatNodes) {
        if (n._id === currentNode?._id) continue;

        const searchText = cachedSearchIndex.get(n._id);
        if (!searchText) continue;

        if (typed && !searchText.includes(typed)) continue;

        const isFolder = n.type === 'folder';

        const relativePath = getRelativePath(currentNode?.path ?? '', n.path!);

        options.push({
          label: n.title,
          title: n.title,
          type: isFolder ? 'folder' : 'file',
          parentId: n.parentId,

          detail: relativePath,

          apply: (view, completion, from, to) => {
            const doc = view.state.doc;

            const nextChars = doc.sliceString(to, to + 2);
            const shouldClose = nextChars !== ']]';

            const insertText = relativePath + (isFolder ? '/' : shouldClose ? ']]' : '');

            view.dispatch({
              changes: { from, to, insert: insertText },
              selection: {
                anchor: from + relativePath.length + (isFolder ? 1 : shouldClose ? 2 : 0),
              },
            });
          },
        });

        if (options.length >= 50) break; // limit results
      }

      return {
        from: word.from + 2,
        options,
        filter: false,
      };
    },
  ],
});

export const internalLinkClickHandler = EditorView.domEventHandlers({
  click(event) {
    const el = (event.target as HTMLElement).closest('.cm-internal-link') as HTMLElement | null;
    if (!el) return false;

    const link = el.dataset.internalLink;
    if (!link) return false;

    const state = useNodeStore.getState();
    const nodes = state.nodes;
    const currentNode = state.activeNode;

    const flatNodes = flattenNodeTree(nodes);

    const absolutePath = resolveRelativePath(currentNode?.path ?? '', link);

    const node = flatNodes.find(n => n.path === absolutePath);
    if (!node) return false;

    const { openTab } = useTabStore.getState();

    openTab(node.projectId, node, true);
    state.setActiveNode(node._id);

    event.preventDefault();
    return true;
  },
});
