// lib/livePreviewDecorations.ts

import { Decoration, WidgetType } from '@codemirror/view';

// Define the EmptyWidget class once, as it's used by all replacement decorations
class EmptyWidget extends WidgetType {
  toDOM() {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.width = '0';
    span.style.height = '0';
    return span;
  }
}

const emptyWidget = new EmptyWidget();

// ==========================================================
//                        DECORATION FUNCTIONS
// ==========================================================

export function getBoldDecorations(
  line: { from: number; text: string },
  isCursorOnThisLine: boolean
) {
  const widgets: any[] = [];
  const regex = /\*\*(.*?)\*\*/g;
  let match;

  while ((match = regex.exec(line.text)) !== null) {
    const start = line.from + match.index;
    const innerStart = start + 2;
    const innerEnd = innerStart + match[1].length;
    const end = start + match[0].length;

    if (innerStart < innerEnd) {
      widgets.push(Decoration.mark({ class: 'cm-strong' }).range(innerStart, innerEnd));
    }

    if (!isCursorOnThisLine) {
      widgets.push(Decoration.replace({ widget: emptyWidget }).range(start, innerStart));
      widgets.push(Decoration.replace({ widget: emptyWidget }).range(innerEnd, end));
    }
  }

  return widgets;
}

export function getItalicDecorations(
  line: { from: number; text: string },
  isCursorOnThisLine: boolean
) {
  const widgets: any[] = [];
  const regex = /(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g;
  let match;

  while ((match = regex.exec(line.text)) !== null) {
    const start = line.from + match.index;
    const end = start + match[0].length;
    const firstStar = start;
    const secondStar = end - 1;
    const innerStart = firstStar + 1;
    const innerEnd = secondStar;

    if (innerStart < innerEnd) {
      widgets.push(Decoration.mark({ class: 'cm-em' }).range(innerStart, innerEnd));
    }

    if (!isCursorOnThisLine) {
      widgets.push(Decoration.replace({ widget: emptyWidget }).range(firstStar, firstStar + 1));
      widgets.push(Decoration.replace({ widget: emptyWidget }).range(secondStar, secondStar + 1));
    }
  }
  return widgets;
}

export function getLinkDecorations(
  line: { from: number; text: string },
  isCursorOnThisLine: boolean
) {
  const widgets: any[] = [];
  const regex = /\[(.*?)\]\((.*?)\)/g;
  let match;

  while ((match = regex.exec(line.text)) !== null) {
    const start = line.from + match.index;
    const end = start + match[0].length;

    const textEnd = start + match[0].indexOf(']');
    const urlStart = start + match[0].indexOf('(');

    if (!isCursorOnThisLine) {
      widgets.push(Decoration.replace({ widget: emptyWidget }).range(start, start + 1));
      widgets.push(Decoration.replace({ widget: emptyWidget }).range(textEnd, textEnd + 1));
      widgets.push(Decoration.replace({ widget: emptyWidget }).range(urlStart, end));
    }
  }

  return widgets;
}

export function getBlockquoteDecorations(
  line: { from: number; text: string },
  isCursorOnThisLine: boolean
) {
  const widgets: any[] = [];
  const regex = /^(>\s*)+/g;
  const match = regex.exec(line.text);

  if (match) {
    const start = line.from;
    const delimiterEnd = start + match[0].length;

    if (line.to > delimiterEnd) {
      widgets.push(
        Decoration.mark({ class: 'cm-blockquote-content' }).range(delimiterEnd, line.to)
      );
    }

    if (!isCursorOnThisLine) {
      widgets.push(Decoration.replace({ widget: emptyWidget }).range(start, delimiterEnd));
    }
  }
  return widgets;
}

export function getTableDecorations(
  line: { from: number; text: string },
  isCursorOnThisLine: boolean
) {
  const widgets: any[] = [];

  if (isCursorOnThisLine) return widgets;

  if (line.text.includes('|')) {
    const pipeRegex = /\|/g;
    let match;

    while ((match = pipeRegex.exec(line.text)) !== null) {
      const pipeStart = line.from + match.index;
      const pipeEnd = pipeStart + 1;

      widgets.push(Decoration.replace({ widget: emptyWidget }).range(pipeStart, pipeEnd));
    }
  }

  const separatorRegex = /^(\s*\|(\s*[:]?\s*[-]+\s*[:]?\s*)+\|?\s*)$/g;
  if (separatorRegex.test(line.text.trim())) {
    widgets.push(Decoration.replace({ widget: emptyWidget }).range(line.from, line.to));
  }

  return widgets;
}

export function getHrDecorations(
  line: { from: number; text: string },
  isCursorOnThisLine: boolean
) {
  const widgets: any[] = [];
  const hrRegex = /^\s*([-_*]{3,})\s*$/;
  const match = hrRegex.exec(line.text);

  if (match) {
    if (line.text.trim().length > 0) {
      widgets.push(Decoration.mark({ class: 'cm-hr' }).range(line.from, line.to));
    }

    if (!isCursorOnThisLine) {
      widgets.push(Decoration.replace({ widget: emptyWidget }).range(line.from, line.to));
    }
  }

  return widgets;
}

export function getHeadingDecorations(
  line: { from: number; to: number; text: string },
  isCursorOnThisLine: boolean
) {
  const widgets: any[] = [];
  const headingMatch = line.text.match(/^(#+)\s+(.*)/);

  if (headingMatch) {
    const hashesLength = headingMatch[1].length;
    const start = line.from;
    const spacePosition = start + hashesLength;

    // Mark the actual text for styling
    widgets.push(
      Decoration.mark({ class: `cm-header-${hashesLength}` }).range(spacePosition + 1, line.to)
    );

    if (!isCursorOnThisLine) {
      // Hide hashes and the space after it
      widgets.push(Decoration.replace({ widget: emptyWidget }).range(start, spacePosition + 1));
    }
  }
  return widgets;
}
