import { ChangeSpec, EditorView } from '@uiw/react-codemirror';

interface IProps {
  editorViewRef: React.RefObject<EditorView | null>;
  cursorPos: number;
}
export const handleEdit = ({ editorViewRef, cursorPos }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;
  const line = view.state.doc.lineAt(cursorPos);
  const cursorEndPos = line.to;

  view.dispatch({
    selection: { anchor: cursorEndPos, head: cursorEndPos },
    scrollIntoView: true,
  });
  setTimeout(() => {
    view.focus();
  }, 0);
};

export const editCalloutType = ({ editorViewRef, cursorPos, newType }: IProps & { newType: string }) => {
  const view = editorViewRef.current;
  if (!view) return;

  const line = view.state.doc.lineAt(cursorPos);

  if (!line.text.match(/^\s{0,3}>?\s*\[!(\w+)\]/i)) return;

  let newLineText;
  if (newType === '') {
    newLineText = line.text.replace(/^(\s{0,3}>)\s*\[!\w+\]\s*/i, '$1 ');
  } else {
    newLineText = line.text.replace(/(\[!)\w+(\])/i, `$1${newType}$2`);
  }

  view.dispatch({
    changes: {
      from: line.from,
      to: line.to,
      insert: newLineText,
    },
  });

  setTimeout(() => {
    view.focus();
  }, 0);
};

export const removeCallout = ({ editorViewRef, cursorPos }: IProps) => {
  const view = editorViewRef.current;
  if (!view) return;

  const firstLine = view.state.doc.lineAt(cursorPos);

  // Find the start of the callout block
  let startLine = firstLine.number;
  while (startLine > 1) {
    const prevLine = view.state.doc.line(startLine - 1);
    if (prevLine.text.trim().startsWith('>')) {
      startLine--;
    } else {
      break;
    }
  }

  let endLine = firstLine.number;
  while (endLine < view.state.doc.lines) {
    const nextLine = view.state.doc.line(endLine + 1);
    if (nextLine.text.trim().startsWith('>')) {
      endLine++;
    } else {
      break;
    }
  }

  const changes: ChangeSpec[] = [];
  let lastLineNewText = '';
  let lastLineFrom = 0;

  for (let i = startLine; i <= endLine; i++) {
    const line = view.state.doc.line(i);

    let newText;
    if (i === startLine) {
      newText = line.text.replace(/^\s{0,3}>\s*\[!\w+\]\s*/, '');
    } else {
      newText = line.text.replace(/^\s{0,3}>\s?/, '');
    }

    if (i === endLine) {
      lastLineNewText = newText;
      lastLineFrom = line.from;
    }

    changes.push({
      from: line.from,
      to: line.to,
      insert: newText,
    });
  }

  view.dispatch({
    changes: changes,
    selection: { anchor: lastLineFrom + lastLineNewText.length },
  });

  setTimeout(() => {
    view.focus();
  }, 0);
};
