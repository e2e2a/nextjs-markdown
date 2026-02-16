import { TablePreviewWidget } from '@/features/widgets';
import { EditorState, EditorView } from '@uiw/react-codemirror';
export type PendingTableFocus = {
  row: number;
  col: number;
} | null;

export function splitRow(row: string): string[] {
  const trimmed = row.trim();

  if (trimmed === '|') return [];

  let content = trimmed;
  if (content.startsWith('|')) content = content.slice(1);
  if (content.endsWith('|')) content = content.slice(0, -1);
  return content.split(/(?<!\\)\|/).map(cell => cell.trim());
}

function isStrictSeparatorRow(line: string, cols: number): boolean {
  const trimmed = line.trim();
  if (!trimmed.endsWith('|')) return false;
  const cells = splitRow(line);
  if (cells.length !== cols) return false;

  return cells.every(cell => /^:?-{3,}:?$/.test(cell.trim()));
}

export function isValidTable(lines: string[]): boolean {
  if (lines.length < 2) return false;

  const headerCols = splitRow(lines[0]);
  const columnCount = headerCols.length;

  if (!isStrictSeparatorRow(lines[1], columnCount)) return false;
  for (let i = 2; i < lines.length; i++) if (splitRow(lines[i]).length !== columnCount) return false;
  return true;
}

// ------------------------------
// Helper: Find full table range
// ------------------------------
export function getTableRange(state: EditorState, startLine: number) {
  let endLine = startLine;
  const currentLines: string[] = [state.doc.line(startLine).text];

  for (let i = startLine + 1; i <= state.doc.lines; i++) {
    const nextLineText = state.doc.line(i).text;

    if (nextLineText.trim().startsWith('|')) {
      if (isValidTable(currentLines)) {
        const rowCols = splitRow(nextLineText).length;
        const tableCols = splitRow(currentLines[0]).length;

        if (rowCols === tableCols) {
          endLine = i;
          currentLines.push(nextLineText);
        } else {
          break;
        }
      } else {
        endLine = i;
        currentLines.push(nextLineText);
      }
    } else {
      break;
    }
  }
  return { start: startLine, end: endLine };
}

export function createTableActionButton(type: 'row' | 'col', onAction: () => void): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = `cm-table-unified-${type}-trigger`;

  const btn = document.createElement('span');
  btn.textContent = '+';

  btn.onmousedown = e => {
    e.preventDefault();
    e.stopPropagation();
    onAction();
  };

  wrapper.appendChild(btn);
  return wrapper;
}

export function addTableColumn(data: string[][]): string[][] {
  return data.map((row, idx) => (idx === 1 ? [...row, '---'] : [...row, ' ']));
}

export function addTableRow(data: string[][]): string[][] {
  return [...data, new Array(data[0].length).fill(' ')];
}

function isSeparatorRow(row: string[]): boolean {
  return row.every(cell => /^:?-{3,}:?$/.test(cell.trim()));
}
export function serializeTable(data: string[][]): string {
  return data
    .map(row => {
      if (isSeparatorRow(row)) {
        // ensure every column is a valid separator
        return `| ${row.map(() => '---').join(' | ')} |`;
      }

      return `| ${row.map(c => c || ' ').join(' | ')} |`;
    })
    .join('\n');
}

export function handleTableTabNavigation(widget: TablePreviewWidget, view: EditorView, tableData: string[][], editor: HTMLElement, shiftKey: boolean) {
  const pos = getTablePosition(editor);
  if (!pos) return;

  const { table, rowIndex, cellIndex } = pos;

  if (shiftKey) {
    let r = rowIndex;
    let c = cellIndex - 1;

    if (c < 0) {
      r--;
      if (r < 0) return;
      c = table.rows[r].cells.length - 1;
    }

    const target = table.rows[r].cells[c].querySelector('.cm-table-cell-editor') as HTMLElement | null;

    target?.focus();
    return;
  }

  let r = rowIndex;
  let c = cellIndex + 1;

  if (c >= table.rows[r].cells.length) {
    r++;
    c = 0;
  }

  if (r < table.rows.length) {
    const target = table.rows[r].cells[c].querySelector('.cm-table-cell-editor') as HTMLElement | null;

    target?.focus();
    return;
  }

  const next = addTableRow(tableData);

  view.dispatch({
    changes: { from: widget.from, to: widget.to, insert: serializeTable(next) },
  });
  focusTableCell(view, widget.from, next.length - 1, 0);
}

export function handleTableEnterNavigation(widget: TablePreviewWidget, view: EditorView, tableData: string[][], editor: HTMLElement) {
  const pos = getTablePosition(editor);
  if (!pos) return;

  const { table, rowIndex, cellIndex } = pos;
  const nextRowIndex = rowIndex + 1;

  if (nextRowIndex < table.rows.length) {
    const target = table.rows[nextRowIndex].cells[cellIndex].querySelector('.cm-table-cell-editor') as HTMLElement | null;

    if (target) {
      target.focus();
      const selection = window.getSelection();
      selection?.collapse(target, 0);
    }
    return;
  }

  const next = addTableRow(tableData);

  view.dispatch({
    changes: { from: widget.from, to: widget.to, insert: serializeTable(next) },
  });

  const waitAndFocus = () => {
    const container = view.dom.querySelector('.cm-table-widget-container') as HTMLElement;
    if (!container) return;

    const newRow = container.querySelectorAll('tr')[nextRowIndex];
    if (!newRow) {
      requestAnimationFrame(waitAndFocus);
      return;
    }

    const target = newRow.cells[cellIndex].querySelector('.cm-table-cell-editor') as HTMLElement | null;
    if (target) {
      target.focus();
      const selection = window.getSelection();
      selection?.collapse(target, 0);
    } else {
      requestAnimationFrame(waitAndFocus);
    }
  };

  requestAnimationFrame(waitAndFocus);
}
function getTablePosition(editor: HTMLElement) {
  const cell = editor.closest('td, th') as HTMLTableCellElement | null;
  const row = cell?.parentElement as HTMLTableRowElement | null;
  const table = row?.closest('table') as HTMLTableElement | null;

  if (!cell || !row || !table) return null;

  return {
    cell,
    row,
    table,
    rowIndex: Array.from(table.rows).indexOf(row),
    cellIndex: Array.from(row.cells).indexOf(cell),
  };
}

export function focusTableCell(view: EditorView, widgetFrom: number, rowIndex: number, colIndex: number) {
  requestAnimationFrame(() => {
    const tableContainer = view.dom.querySelector(`.cm-table-widget-container[data-from="${widgetFrom}"]`) as HTMLElement | null;

    if (!tableContainer) return;

    const cssRowIndex = rowIndex > 1 ? rowIndex : rowIndex + 1;
    const cellSelector =
      rowIndex === 0 ? `tr:nth-child(${cssRowIndex}) th:nth-child(${colIndex + 1})` : `tr:nth-child(${cssRowIndex}) td:nth-child(${colIndex + 1})`;

    const targetEditor = tableContainer.querySelector(`${cellSelector} .cm-table-cell-editor`) as HTMLElement | null;

    targetEditor?.focus();
  });
}

export function updateTable(view: EditorView, from: number, to: number, data: string[][]) {
  view.dispatch({ changes: { from, to, insert: serializeTable(data) } });
}

export function removeTableColumn(data: string[][], colIndex: number): string[][] {
  return data.map(row => {
    const newRow = [...row];
    newRow.splice(colIndex, 1);
    return newRow;
  });
}

export function moveTableColumn(data: string[][], fromIndex: number, toIndex: number): string[][] {
  return data.map(row => {
    const newRow = [...row];
    const [moved] = newRow.splice(fromIndex, 1);
    newRow.splice(toIndex, 0, moved);
    return newRow;
  });
}

export function selectColumn(container: HTMLElement, colIndex: number | null) {
  container.querySelectorAll('.cm-table-col-selected').forEach(el => el.classList.remove('cm-table-col-selected'));
  if (colIndex !== null) {
    container
      .querySelectorAll(`td:nth-child(${colIndex + 1}), th:nth-child(${colIndex + 1})`)
      .forEach(cell => cell.classList.add('cm-table-col-selected'));
    container.focus();
  }
}

export function cleanPastedColumn(text: string) {
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.match(/^\|?\s*:?---*:?\s*\|?$/))
    .map(l => l.replace(/^\||\|$/g, '').trim());
}

export function getAllTableRanges(state: EditorState) {
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
