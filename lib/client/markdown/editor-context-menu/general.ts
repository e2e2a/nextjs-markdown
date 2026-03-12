import { EditorView } from '@uiw/react-codemirror';
import { focusTableCell } from '../markdown-table-utils';

interface IProps {
  editorViewRef: React.RefObject<EditorView | null>;
}
const getSmartInsert = (view: EditorView, template: string) => {
  const { state } = view;
  const line = state.doc.lineAt(state.selection.main.head);
  const isFirstLine = line.number === 1;
  const hasContent = line.text.trim() !== '';

  let prefix = '';
  if (hasContent) {
    prefix = '\n\n';
  } else if (isFirstLine) {
    prefix = '\n';
  } else {
    prefix = '\n';
  }

  const suffix = '\n';
  const fullInsert = `${prefix}${template}${suffix}`;

  const insertPos = hasContent ? line.to : line.from;

  return {
    insertPos,
    prefix,
    fullInsert,
    widgetFrom: insertPos + prefix.length,
  };
};

export const insertTable = ({ editorViewRef }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;

  const template = `|   |   |\n| --- | --- |\n|   |   |`;
  const { insertPos, fullInsert, widgetFrom } = getSmartInsert(view, template);

  view.dispatch({
    changes: { from: insertPos, to: insertPos, insert: fullInsert },
    selection: { anchor: widgetFrom },
    userEvent: 'input.table',
    scrollIntoView: true,
  });

  requestAnimationFrame(() => focusTableCell(view, widgetFrom, 0, 0));
};

export const insertHorizontalRule = ({ editorViewRef }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;

  const { insertPos, fullInsert } = getSmartInsert(view, '---\n');

  view.dispatch({
    changes: { from: insertPos, to: insertPos, insert: fullInsert },
    selection: { anchor: insertPos + fullInsert.length },
    userEvent: 'input.hr',
    scrollIntoView: true,
  });
};

export const insertCodeBlock = ({ editorViewRef }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;

  const template = '```\n\n```';
  const { insertPos, fullInsert, widgetFrom } = getSmartInsert(view, template);

  view.dispatch({
    changes: { from: insertPos, to: insertPos, insert: fullInsert },
    selection: { anchor: widgetFrom + 4 },
    userEvent: 'input.code',
    scrollIntoView: true,
  });
};

// Math and NewBase now just call a simplified getBlockInsertion
const genericInsert = (view: EditorView, template: string, type: string) => {
  const { insertPos, fullInsert, widgetFrom } = getSmartInsert(view, template);
  view.dispatch({
    changes: { from: insertPos, to: insertPos, insert: fullInsert },
    selection: { anchor: widgetFrom + template.indexOf('\n') + 1 },
    userEvent: `input.${type}`,
    scrollIntoView: true,
  });
};

export const insertMathBlock = ({ editorViewRef }: IProps) => editorViewRef.current && genericInsert(editorViewRef.current, '$$\n\n$$', 'math');

export const insertCallout = ({ editorViewRef }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;

  const { from, to } = view.state.selection.main;
  const selectedText = view.state.sliceDoc(from, to);

  if (selectedText && from !== to) {
    const lines = selectedText.split('\n');

    const calloutLines = lines.map(line => {
      const trimmed = line.trim();
      return trimmed ? `> ${line}` : '>';
    });

    const newText = `> [!NOTE]\n${calloutLines.join('\n')}\n`;

    view.dispatch({
      changes: { from, to, insert: newText },
      selection: { anchor: from + 3 },
      userEvent: 'input.callout',
      scrollIntoView: true,
    });
  } else {
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    const trimmed = line.text.trim();

    const template = trimmed.length > 0 ? `> [!NOTE]\n> ${line.text}\n` : `> [!NOTE] Title\n> Contents\n`;

    const { insertPos, fullInsert, widgetFrom } = getSmartInsert(view, template);

    const cursorOffset = template.indexOf(trimmed || 'Contents');
    const cursorAnchor = widgetFrom + cursorOffset;
    const cursorHead = cursorAnchor + (trimmed ? 0 : 8);

    view.dispatch({
      changes: { from: insertPos, to: insertPos, insert: fullInsert },
      selection: {
        anchor: cursorAnchor,
        head: cursorHead,
      },
      userEvent: 'input.callout',
      scrollIntoView: true,
    });
  }

  view.focus();
};

export const toggleList = ({ editorViewRef, type }: IProps & { type: 'bullet' | 'number' | 'task' | 'quote' }) => {
  const view = editorViewRef.current;
  if (!view) return;

  const line = view.state.doc.lineAt(view.state.selection.main.head);

  // 1. Capture the "Quote" layer and the "Rest" of the line
  const blockMatch = line.text.match(/^((?:>\s*)*)(.*)/);
  if (!blockMatch) return;

  const quotes = blockMatch[1];
  const rest = blockMatch[2];

  let newText = '';

  if (type === 'quote') {
    newText = quotes.startsWith('>') ? quotes.replace(/^>\s?/, '') + rest : `> ${line.text}`;
  } else {
    const markerMatch = rest.match(/^([\*\-\+] \s*|\d+\.\s*|- \[[\s xX]\]\s*)?(.*)/);
    const existing = markerMatch?.[1] || '';
    const content = markerMatch?.[2] || '';

    const markers = {
      bullet: '- ',
      number: '1. ',
      task: '- [ ] ',
    };

    const target = markers[type as keyof typeof markers];

    const isBulletFamily = /^[\*\-\+] /.test(existing);
    const isTargetBullet = type === 'bullet';

    if (isTargetBullet && isBulletFamily) {
      newText = `${quotes}${content}`;
    } else if (existing.trim() === target.trim()) {
      newText = `${quotes}${content}`;
    } else {
      newText = `${quotes}${target}${content}`;
    }
  }

  view.dispatch({
    changes: { from: line.from, to: line.to, insert: newText },
    selection: { anchor: line.from + newText.length },
  });
  view.focus();
};

export const toggleHeading = ({ editorViewRef, level }: IProps & { level: number }) => {
  const view = editorViewRef.current;
  if (!view) return;

  const line = view.state.doc.lineAt(view.state.selection.main.head);
  const match = line.text.match(/^((?:>\s*)*)(#{1,6}\s*)?(.*)/);
  if (!match) return;

  const [, blockPrefix, existingHashes, content] = match;
  const targetHashes = '#'.repeat(level);
  const hashesToUse = existingHashes?.trim() === targetHashes ? '' : `${targetHashes} `;

  const newText = `${blockPrefix}${hashesToUse}${content || (hashesToUse ? `Heading ${level}` : '')}`;

  view.dispatch({
    changes: { from: line.from, to: line.to, insert: newText },
    selection: { anchor: line.from + newText.length },
  });
  view.focus();
};

export const clearFormatting = ({ editorViewRef }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;
  const { from, to } = view.state.selection.main;
  if (from === to) return;
  const clean = view.state.sliceDoc(from, to).replace(/(\*\*|__|\*|_|~~|==|`|\$|%%)/g, '');
  view.dispatch({ changes: { from, to, insert: clean }, selection: { anchor: from + clean.length } });
  view.focus();
};

export const toggleInlineFormat = ({ editorViewRef, symbol }: IProps & { symbol: string }) => {
  const view = editorViewRef.current;
  if (!view) return;

  const { state } = view;
  const { from, to } = state.selection.main;
  const symLen = symbol.length;

  let selFrom = from;
  let selTo = to;
  if (selFrom === selTo) {
    const word = state.wordAt(selFrom);
    if (word) {
      selFrom = word.from;
      selTo = word.to;
    }
  }

  const textBefore = state.sliceDoc(selFrom - symLen, selFrom);
  const textAfter = state.sliceDoc(selTo, selTo + symLen);
  const isWrappedOutside = textBefore === symbol && textAfter === symbol;

  const selectedText = state.sliceDoc(selFrom, selTo);
  const isWrappedInside = selectedText.startsWith(symbol) && selectedText.endsWith(symbol);

  let changes;
  let newSelection;

  if (isWrappedOutside) {
    changes = {
      from: selFrom - symLen,
      to: selTo + symLen,
      insert: selectedText,
    };
    newSelection = { anchor: selFrom - symLen, head: selTo - symLen };
  } else if (isWrappedInside) {
    const unwrapped = selectedText.slice(symLen, -symLen);
    changes = { from: selFrom, to: selTo, insert: unwrapped };
    newSelection = { anchor: selFrom, head: selFrom + unwrapped.length };
  } else {
    changes = { from: selFrom, to: selTo, insert: `${symbol}${selectedText}${symbol}` };
    newSelection = { anchor: selFrom + symLen, head: selFrom + symLen + selectedText.length };
  }

  view.dispatch({
    changes,
    selection: newSelection,
    scrollIntoView: true,
    userEvent: 'input.format',
  });
  view.focus();
};

export const setAsBody = ({ editorViewRef }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;

  const line = view.state.doc.lineAt(view.state.selection.main.head);
  const cleanText = line.text.replace(/^((?:>\s*)*)#{1,6}\s+/, '$1');
  if (cleanText === line.text) return;

  view.dispatch({
    changes: { from: line.from, to: line.to, insert: cleanText },
    selection: { anchor: line.from + cleanText.length },
    userEvent: 'format.unheading',
  });

  view.focus();
};

/**
 * Internal Link: [[Link]]
 */
export const insertInternalLink = ({ editorViewRef }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;
  const { state } = view;
  const { from, to } = state.selection.main;
  const selectedText = state.sliceDoc(from, to) || 'Link';

  const insert = `[[${selectedText}]]`;

  view.dispatch({
    changes: { from, to, insert },
    selection: {
      anchor: from + 2,
      head: from + 2 + selectedText.length,
    },
    userEvent: 'input.link.internal',
  });
  view.focus();
};

/**
 * External Link: [Text](url)
 */
export const insertExternalLink = ({ editorViewRef }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;
  const { state } = view;
  const { from, to } = state.selection.main;
  const selectedText = state.sliceDoc(from, to) || 'Text';

  const insert = `[${selectedText}](url)`;
  const hasSelection = from !== to;

  view.dispatch({
    changes: { from, to, insert },
    selection: {
      anchor: from + (hasSelection ? selectedText.length + 3 : 1),
      head: from + (hasSelection ? selectedText.length + 6 : 1 + selectedText.length),
    },
    userEvent: 'input.link.external',
  });
  view.focus();
};

/**
 * Editor default command
 */
export const editorCut = ({ editorViewRef }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;
  view.focus();
  document.execCommand('cut');
};

export const editorCopy = ({ editorViewRef }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;
  view.focus();
  document.execCommand('copy');
};

export const editorSelectAll = ({ editorViewRef }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;
  view.focus();
  view.dispatch({
    selection: { anchor: 0, head: view.state.doc.length },
    scrollIntoView: true,
  });
};

export const editorPaste = async ({ editorViewRef }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;
  view.focus();
  try {
    const text = await navigator.clipboard.readText();
    view.dispatch(view.state.replaceSelection(text));
  } catch (err) {
    console.warn('Standard paste blocked or failed:', err);
  }
};

/**
 * This Bottom is all for UI/UX management
 * 1. Putting decoration Check if its active
 */

/**
 * This is only for highlighting for UI when there is already a symbol
 * @param text
 * @param pos
 * @param symbol
 * @returns
 */
export const getFormatStatus = (text: string, pos: number, symbol: string) => {
  if (!text || pos === undefined) return false;
  const lastOpen = text.slice(0, pos).lastIndexOf(symbol);
  const nextClose = text.slice(pos).indexOf(symbol);
  return lastOpen !== -1 && nextClose !== -1;
};

export const isFormatActive = ({ currentLineText, cursorPos, symbol }: { currentLineText: string; cursorPos: number; symbol: string }) => {
  if (!currentLineText || cursorPos === undefined) return false;

  const beforeCursor = currentLineText.slice(0, cursorPos);
  const afterCursor = currentLineText.slice(cursorPos);

  const lastOpen = beforeCursor.lastIndexOf(symbol);
  const nextClose = afterCursor.indexOf(symbol);

  if (lastOpen === -1 || nextClose === -1) return false;

  if (symbol === '*') {
    const isPartOfDoubleBefore = currentLineText[lastOpen - 1] === '*' || currentLineText[lastOpen + 1] === '*';
    const isPartOfDoubleAfter = afterCursor[nextClose - 1] === '*' || afterCursor[nextClose + 1] === '*';

    const isTripleBefore = currentLineText.slice(lastOpen, lastOpen + 3) === '***' || currentLineText.slice(lastOpen - 2, lastOpen + 1) === '***';

    if (isTripleBefore) return true;
    if (isPartOfDoubleBefore || isPartOfDoubleAfter) return false;
  }

  if (symbol === '**') {
    const isTriple = currentLineText.slice(lastOpen, lastOpen + 3) === '***' || currentLineText.slice(lastOpen - 1, lastOpen + 2) === '***';
    if (isTriple) return true;
  }

  return true;
};

export const isHeadingActive = ({ currentLineText }: { currentLineText: string }) => {
  // Check if it starts with 1-6 hashes followed by a space
  const isHeading = /^(?:>\s*)*#{1,6}\s/.test(currentLineText);
  return !isHeading;
};
