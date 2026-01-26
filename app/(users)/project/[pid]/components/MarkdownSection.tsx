'use client';
import { useEffect, useState, useMemo } from 'react';
import { EditorView } from '@codemirror/view';
import CodeMirror, { oneDark } from '@uiw/react-codemirror';
import { yCollab } from 'y-codemirror.next';
import { markdown } from '@codemirror/lang-markdown';
import { getSyncProvider } from '@/lib/client/sync-provider';
import { INode } from '@/types';
import { tags } from '@codemirror/highlight';
import { createTheme } from '@uiw/codemirror-themes';

const myOwnDarkTheme = createTheme({
  theme: 'dark', // Inherit basic dark styles
  settings: {
    background: '#191d24', // Your custom background color (e.g., a slightly different dark gray)
    foreground: '#d4d4d4', // Default text color
    caret: '#5d00ff', // Cursor color
    selection: '#3a3a3a', // Selection background
    selectionMatch: '#3a3a3a',
    gutterBackground: '#191d24', // Gutter background
    lineHighlight: '#ffffff0f', // Highlighted line background
  },
  styles: [
    { tag: [tags.keyword], color: '#569cd6' },
    { tag: [tags.string], color: '#ce9178' },
    { tag: [tags.comment], color: '#6a9955', fontStyle: 'italic' },
    { tag: [tags.variableName], color: '#9cdcfe' },
    { tag: [tags.typeName], color: '#4ec9b0' },
    { tag: [tags.heading], color: '#dcdcaa', fontWeight: 'bold' },
    // You can also group multiple tags with the same style:
    { tag: [tags.atom, tags.bool, tags.number], color: '#b5cea8' },
    // Add more tag customizations as needed
  ],
});

export function MarkdownSection({ node }: { node: INode }) {
  const { ydoc, provider } = useMemo(() => getSyncProvider(node._id), [node._id]);
  const ytext = useMemo(() => ydoc.getText('codemirror'), [ydoc]);

  const [content, setContent] = useState(ytext.toString());

  useEffect(() => {
    const onUpdate = () => setContent(ytext.toString());
    ytext.observe(onUpdate);
    return () => {
      ytext.unobserve(onUpdate);
      provider.destroy();
      ydoc.destroy();
    };
  }, [ytext, provider, ydoc]);

  const editorExtensions = useMemo(() => [markdown(), EditorView.lineWrapping, yCollab(ytext, provider.awareness)], [ytext, provider]);

  return (
    <div className="h-screen flex flex-col">
      <CodeMirror value={content} height="100%" theme={myOwnDarkTheme} basicSetup={true} extensions={editorExtensions} className="" />
    </div>
  );
}
