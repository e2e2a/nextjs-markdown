import { EditorView, Decoration, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { StateField, RangeSet, EditorState, StateEffect } from '@codemirror/state';
import { buildDecorations } from '../decorations';
import { TablePreviewWidget } from '../widgets';

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

export const toggleSourceMode = StateEffect.define<boolean>();
export const sourceModeField = StateField.define<boolean>({
  create() {
    return false;
  },
  update(value, tr) {
    for (const e of tr.effects) {
      if (e.is(toggleSourceMode)) return e.value;
    }
    return value;
  },
});

// ------------------------------
// Main StateField
// ------------------------------
export const markdownLivePreviewField = StateField.define<RangeSet<Decoration>>({
  create(state: EditorState) {
    if (state.field(sourceModeField, false)) {
      return RangeSet.empty;
    }
    return buildDecorations(state);
  },
  update(decos, tr) {
    console.log('run');
    if (tr.docChanged || tr.selection || tr.reconfigured || tr.effects.some(e => e.is(toggleSourceMode))) {
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
          if (widget && widget.selectedColumn !== null) widget.selectedColumn = null;
        }
      });
    }
  }
);
