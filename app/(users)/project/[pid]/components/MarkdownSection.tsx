'use client';
import { useEffect, useMemo, useRef } from 'react';
import { drawSelection, dropCursor, EditorView, keymap } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { yCollab } from 'y-codemirror.next';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { createTheme } from '@uiw/codemirror-themes';
import { getSyncProvider } from '@/lib/client/sync-provider';
import { INode } from '@/types';
import { Separator } from '@/components/ui/separator';
import { ArrowUpNarrowWide, List, Search } from 'lucide-react';
import { tags as t } from '@lezer/highlight';
import { columnSelectionField, markdownLivePreviewField, tableSelectionHighlighter, tableSpacingManager } from '@/features/plugins';
import { languages } from '@codemirror/language-data';
import { selectAllToTop, tableBackspace, tableKeyboardHandler } from '@/features/editor/keymap';
import { history, historyKeymap } from '@codemirror/commands';

const myOwnDarkTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#191d24',
    foreground: '#d4d4d4',
    caret: '#ffffff',
    // selection: '#5d00ff',
    selectionMatch: '#3a3a3a',
    gutterBackground: '#191d24',
    lineHighlight: '#ffffff0f',
  },
  styles: [
    { tag: [t.keyword], color: '#569cd6' },
    { tag: [t.string], color: '#ce9178' },
    { tag: [t.comment], color: '#6a9955', fontStyle: 'italic' },
    { tag: [t.variableName], color: '#9cdcfe' },
    { tag: [t.function(t.variableName), t.propertyName], color: '#dcdcaa' },
    { tag: [t.typeName, t.className], color: '#4ec9b0' },
    { tag: [t.number, t.bool, t.null, t.atom], color: '#b5cea8' },
    { tag: t.operator, color: '#d4d4d4' },
    { tag: [t.typeName], color: '#4ec9b0' },
    { tag: [t.heading], color: '#dcdcaa', fontWeight: 'bold' },
    { tag: [t.atom, t.bool, t.number], color: '#b5cea8' },
  ],
});

export function MarkdownSection({ node }: { node: INode }) {
  const { ydoc, provider } = useMemo(() => getSyncProvider(node._id), [node._id]);
  const ytext = useMemo(() => ydoc.getText('codemirror'), [ydoc]);
  const editorViewRef = useRef<EditorView | null>(null);
  // const [content, setContent] = useState(ytext.toString());

  useEffect(() => {
    // const onUpdate = () => setContent(ytext.toString());
    // ytext.observe(onUpdate);
    return () => {
      // ytext.unobserve(onUpdate);
      provider.destroy();
      ydoc.destroy();
    };
  }, [ytext, provider, ydoc]);

  const editorExtensions = useMemo(
    () => [
      history(),
      tableBackspace,
      tableSelectionHighlighter,
      tableKeyboardHandler,
      tableSpacingManager,
      keymap.of([{ key: 'Mod-a', run: selectAllToTop }, ...historyKeymap]),
      myOwnDarkTheme,
      drawSelection(),
      dropCursor(),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
        addKeymap: true,
      }),
      EditorView.lineWrapping,
      yCollab(ytext, provider.awareness),
      columnSelectionField,
      markdownLivePreviewField,
    ],
    [ytext, provider]
  );

  return (
    <div className="h-full! grid grid-cols-1 max-h-full px-5 overflow-y-auto overflow-hidden">
      <div
        onMouseDown={e => {
          e.preventDefault();
          const view = editorViewRef.current;
          if (!view || view.hasFocus) return;
          view.focus();
        }}
        className="w-full h-auto pb-12 cursor-text"
      >
        <CodeMirror
          // value={content}
          onCreateEditor={view => {
            editorViewRef.current = view;
          }}
          theme={myOwnDarkTheme}
          basicSetup={false}
          extensions={editorExtensions}
          className="h-auto"
        />
      </div>

      <div className="pb-12">
        <Separator className="w-full border-border" />
        <div className="flex items-center justify-end py-5 gap-x-2">
          <List className="h-5 w-5" />
          <ArrowUpNarrowWide className="h-5 w-5" />
          <Search className="h-5 w-5" />
        </div>

        <div className="space-y-5">
          <div className="flex flex-col">
            <div className="flex gap-x-1 items-center">
              <h3 className="text-foreground">Linked Mentions</h3>
              <p>0</p>
            </div>
            <p className="text-muted-foreground/80">No backlinks found.</p>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-x-1 items-center">
              <h3 className="text-foreground">Unlinked Mentions</h3>
              <p>0</p>
            </div>
            <p className="text-muted-foreground/80">No backlinks found.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
