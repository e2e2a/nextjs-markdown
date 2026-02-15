import { Decoration } from '@codemirror/view';
import { Range as StateRange, EditorState } from '@codemirror/state';

// import { tags as t } from '@lezer/highlight';
import { BulletWidget, FenchCodeWidget, TablePreviewWidget } from '@/features/widgets';
import { getTableRange, isValidTable } from '@/lib/client/markdown/markdown-table-utils';

export function getHeadingDecos(text: string, lineFrom: number, isLineActive: boolean): StateRange<Decoration>[] {
  const decos: StateRange<Decoration>[] = [];
  const match = text.match(/^(#{1,6})\s/);

  if (match) {
    const level = match[1].length;
    decos.push(Decoration.line({ attributes: { class: `cm-h${level}` } }).range(lineFrom));

    if (!isLineActive) {
      decos.push(Decoration.replace({}).range(lineFrom, lineFrom + match[0].length));
    }
  }
  return decos;
}

export function getBoldDecos(text: string, lineFrom: number, isLineActive: boolean): StateRange<Decoration>[] {
  const decos: StateRange<Decoration>[] = [];
  const boldRegex = /\*\*(.*?)\*\*/g;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    const start = lineFrom + match.index;
    const end = start + match[0].length;

    decos.push(Decoration.mark({ class: 'cm-bold-text' }).range(start, end));

    if (!isLineActive) {
      decos.push(Decoration.mark({ class: 'cm-syntax-hide' }).range(start, start + 2));
      decos.push(Decoration.mark({ class: 'cm-syntax-hide' }).range(end - 2, end));
    }
  }
  return decos;
}

export function getInlineCodeDecos(text: string, lineFrom: number, isLineActive: boolean): StateRange<Decoration>[] {
  const decos: StateRange<Decoration>[] = [];
  const codeRegex = /`([^`]+)`/g;
  let match;

  while ((match = codeRegex.exec(text)) !== null) {
    const start = lineFrom + match.index;
    const end = start + match[0].length;
    const contentStart = start + 1;
    const contentEnd = end - 1;

    decos.push(Decoration.mark({ class: 'cm-inline-code' }).range(start, end));

    if (!isLineActive) {
      decos.push(Decoration.mark({ class: 'cm-syntax-hide' }).range(start, contentStart));
      decos.push(Decoration.mark({ class: 'cm-syntax-hide' }).range(contentEnd, end));
    }
  }
  return decos;
}

export function getItalicDecos(text: string, lineFrom: number, isLineActive: boolean): StateRange<Decoration>[] {
  const decos: StateRange<Decoration>[] = [];
  const italicRegex = /(^|[^*_])([*_])([^*_]+)\2/g;
  let match;

  while ((match = italicRegex.exec(text)) !== null) {
    const start = lineFrom + match.index + match[1].length;
    const end = start + match[0].length - match[1].length;

    decos.push(Decoration.mark({ class: 'cm-italic-text' }).range(start, end));

    if (!isLineActive) {
      decos.push(Decoration.mark({ class: 'cm-syntax-hide' }).range(start, start + 1));
      decos.push(Decoration.mark({ class: 'cm-syntax-hide' }).range(end - 1, end));
    }
  }

  return decos;
}

export function getBulletListDecos(text: string, lineFrom: number, isLineActive: boolean): StateRange<Decoration>[] {
  const decos: StateRange<Decoration>[] = [];
  const match = text.match(/^(\s*)([-*+])(\s+)/);

  if (match) {
    const indent = match[1].length;
    const markerStart = lineFrom + indent;
    const markerEnd = markerStart + match[2].length;

    if (!isLineActive) {
      decos.push(Decoration.mark({ class: 'cm-syntax-hide' }).range(markerStart, markerEnd));

      decos.push(
        Decoration.widget({
          widget: new BulletWidget(),
          side: 1,
        }).range(markerStart)
      );
    }
  }

  return decos;
}

export function getNumberedListDecos(text: string, lineFrom: number): StateRange<Decoration>[] {
  const decos: StateRange<Decoration>[] = [];
  const match = text.match(/^(\d+\.\s+)/);

  if (match) {
    const prefixLength = match[0].length;
    decos.push(
      Decoration.mark({
        class: 'cm-list-number',
      }).range(lineFrom, lineFrom + prefixLength)
    );
  }

  return decos;
}

export function getFenceDecos(state: EditorState, activeLineNum: number): StateRange<Decoration>[] {
  const decos: StateRange<Decoration>[] = [];
  let isInsideBlock = false;
  let blockStartLine = -1;

  for (let i = 1; i <= state.doc.lines; i++) {
    const line = state.doc.line(i);
    const text = line.text.trim();

    if (text.startsWith('```')) {
      const isOpening = !isInsideBlock;
      let isBlockActive = false;

      if (isOpening) {
        blockStartLine = i;
        let closingLine = i;
        const content = [];
        for (let j = i + 1; j <= state.doc.lines; j++) {
          const nextLine = state.doc.line(j);
          if (nextLine.text.trim().startsWith('```')) {
            closingLine = j;
            break;
          }
          content.push(nextLine.text);
        }

        isBlockActive = activeLineNum >= i && activeLineNum <= closingLine;

        decos.push(
          Decoration.widget({
            widget: new FenchCodeWidget(text.replace('```', '').trim(), content.join('\n')),
            side: 1,
            block: false,
          }).range(line.to)
        );
      } else {
        isBlockActive = activeLineNum >= blockStartLine && activeLineNum <= i;
      }

      decos.push(Decoration.line({ attributes: { class: 'cm-code-block-fence' } }).range(line.from));

      if (!isBlockActive) decos.push(Decoration.mark({ class: 'cm-syntax-hide' }).range(line.from, line.to));

      isInsideBlock = !isInsideBlock;
      continue;
    }

    if (isInsideBlock) decos.push(Decoration.line({ attributes: { class: 'cm-code-block-line' } }).range(line.from));
  }
  return decos;
}

export function getTableDecos(state: EditorState, startLine: number) {
  const line = state.doc.line(startLine);
  if (!line.text.trim().startsWith('|')) return null;

  const range = getTableRange(state, startLine);
  const from = state.doc.line(range.start).from;
  const to = state.doc.line(range.end).to;

  const lines = [];
  for (let i = range.start; i <= range.end; i++) lines.push(state.doc.line(i).text);

  if (!isValidTable(lines)) return { decos: [], skipToLine: range.end };
  return {
    decos: [
      Decoration.replace({
        widget: new TablePreviewWidget(lines.join('\n'), from, to),
        block: true,
        atomic: false,
        side: -1,
      }).range(from, to),
    ],
    skipToLine: range.end,
  };
}

export function getBlockquoteDecos(text: string, lineFrom: number, isLineActive: boolean): StateRange<Decoration>[] {
  const decos: StateRange<Decoration>[] = [];

  const match = text.match(/^(\s{0,3})(>+)\s?/);

  if (!match) return decos;

  const indent = match[1].length;
  const markers = match[2].length;

  const markerStart = lineFrom + indent;
  const markerEnd = markerStart + markers;

  decos.push(
    Decoration.line({
      attributes: { class: 'cm-blockquote' },
    }).range(lineFrom)
  );

  if (!isLineActive) decos.push(Decoration.mark({ class: 'cm-syntax-hide' }).range(markerStart, markerEnd));

  return decos;
}

export function getHRDecos(text: string, lineFrom: number, lineTo: number, isLineActive: boolean): StateRange<Decoration>[] {
  const decos: StateRange<Decoration>[] = [];
  const isHR = /^(\s{0,3})([-*_])(\s*\2){2,}\s*$/.test(text);

  if (isHR) {
    decos.push(Decoration.line({ attributes: { class: 'cm-hr' } }).range(lineFrom));
    if (!isLineActive) decos.push(Decoration.mark({ class: 'cm-syntax-hide' }).range(lineFrom, lineTo));
  }

  return decos;
}

export function getTaskDecos(text: string, lineFrom: number): StateRange<Decoration>[] {
  const decos: StateRange<Decoration>[] = [];
  const match = text.match(/\[([ xX])\]/);

  if (match && match.index !== undefined) {
    const innerStart = lineFrom + match.index + 1;
    const innerEnd = innerStart + 1;

    decos.push(
      Decoration.mark({
        class: 'cm-task-inner',
      }).range(innerStart, innerEnd)
    );
  }

  return decos;
}
