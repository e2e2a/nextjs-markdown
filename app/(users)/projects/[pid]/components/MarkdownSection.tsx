'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { drawSelection, dropCursor, EditorView, keymap } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { createTheme } from '@uiw/codemirror-themes';
// import { getSyncProvider } from '@/lib/client/sync-provider';
import { INode } from '@/types';
import { Separator } from '@/components/ui/separator';
import { ArrowUpNarrowWide, List, Search } from 'lucide-react';
import { tags as t } from '@lezer/highlight';
import { columnSelectionField, markdownLivePreviewField, sourceModeField, tableSelectionHighlighter, toggleSourceMode } from '@/features/editor/plugins';
import { languages } from '@codemirror/language-data';
import { selectAllToTop, tableBackspace, tableKeyboardHandler } from '@/features/editor/keymap';
import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';
import { useTabStore } from '@/features/editor/stores/tabs';
import { useParams } from 'next/navigation';
import { EditorOptions } from './editor-options';

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

export function MarkdownSection({ node, isDirty }: { node: INode; isDirty: boolean }) {
  const [synced, setSynced] = useState(false);
  const [instance, setInstance] = useState<{ ydoc: Y.Doc; provider: HocuspocusProvider } | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const markDirty = useTabStore(state => state.markDirty);
  const pid = useParams().pid as string;

  useEffect(() => {
    if (!node?._id) return;
    const ydoc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: 'ws://localhost:1234',
      name: node._id,
      document: ydoc,
    });

    provider.on('synced', () => {
      setSynced(true);
    });

    // provider.on('status', ({ status }: { status: string }) => {
    //   console.log('🔌 Connection Status:', status);
    // });

    provider.connect();
    requestAnimationFrame(() => {
      setInstance({ ydoc, provider });
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
      setSynced(false);
      setInstance(null);
    };
  }, [node?._id]);

  const ytext = useMemo(() => instance?.ydoc.getText('codemirror'), [instance]);
  const undoManager = useMemo(() => {
    if (!ytext || !instance) return null;
    return new Y.UndoManager(ytext, {
      trackedOrigins: new Set([instance.provider?.awareness?.clientID]),
      captureTimeout: 200,
    });
  }, [ytext, instance]);

  const onDocChange = useMemo(() => {
    return EditorView.updateListener.of(update => {
      if (update.docChanged && update.transactions.some(tr => tr.isUserEvent('input') || tr.isUserEvent('delete')))
        if (!isDirty) markDirty(pid, node._id, true);
    });
  }, [markDirty, pid, node._id, isDirty]);

  const editorExtensions = useMemo(() => {
    if (!instance || !ytext || !undoManager) return [];

    return [
      onDocChange,
      tableBackspace,
      sourceModeField,
      tableSelectionHighlighter,
      tableKeyboardHandler,
      keymap.of([{ key: 'Mod-a', run: selectAllToTop }, ...yUndoManagerKeymap]),
      myOwnDarkTheme,
      drawSelection(),
      dropCursor(),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
        addKeymap: true,
      }),
      yCollab(ytext, instance.provider.awareness, { undoManager }),
      EditorView.lineWrapping,
      columnSelectionField,
      markdownLivePreviewField,
    ];
  }, [instance, ytext, onDocChange, undoManager]);

  const toggleSource = (view: EditorView) => {
    const current = view.state.field(sourceModeField);

    view.dispatch({
      effects: toggleSourceMode.of(!current),
    });
  };

  return (
    <>
      <div className="absolute top-13 left-0 right-0 h-14 z-50 flex items-center px-10 border-b border-white/5 bg-sidebar/20 backdrop-blur-xs pointer-events-auto cursor-default drop-shadow-xs shadow-xs">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-5xl font-bold tracking-tighter text-foreground truncate select-text w-fit! cursor-text">
            {(node as INode)?.title || 'Not Found'}
          </h1>
          {/* <button
          onClick={() => {
            const view = editorViewRef.current;
            if (!view) return;
            toggleSource(view);
          }}
        >
          Source Mode
        </button> */}
          <div className="">
            <EditorOptions editorViewRef={editorViewRef} />
          </div>
        </div>
      </div>
      <div className="h-full! grid grid-cols-1 max-h-full w-full px-10 overflow-y-auto overflow-hidden relative editor-scrollbar">
        <div
          className="w-full h-auto pb-4 flex flex-col"
          onMouseDown={e => {
            const target = e.target as HTMLElement;

            if (target.classList.contains('cm-scroller')) {
              e.preventDefault();

              const view = editorViewRef.current;
              if (!view) return;

              view.focus();
              const endPos = view.state.doc.length;

              view.dispatch({
                selection: { anchor: endPos, head: endPos },
                scrollIntoView: true,
                userEvent: 'select',
              });
            }
          }}
        >
          {synced && instance && ytext && (
            <CodeMirror
              key={node._id}
              value={instance?.ydoc.getText('codemirror').toString() ?? ''}
              onCreateEditor={view => {
                editorViewRef.current = view;
              }}
              theme={myOwnDarkTheme}
              basicSetup={false}
              extensions={editorExtensions}
              className="h-auto!"
            />
          )}
          {!synced && <div className="min-h-full flex items-center justify-center text-5xl leading-1 w-full">Syncing Document...</div>}
          <div
            onMouseDown={() => {
              // e.preventDefault();
              const view = editorViewRef.current;
              if (!view) return;
              setTimeout(() => {
                view.focus();
                const endPos = view.state.doc.length;

                view.dispatch({
                  selection: { anchor: endPos, head: endPos },
                  scrollIntoView: true,
                  userEvent: 'select',
                });
              }, 0);
            }}
            className="cursor-text flex-1  h-full"
          />
        </div>

        <div className="pb-12 ">
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
    </>
  );
}
