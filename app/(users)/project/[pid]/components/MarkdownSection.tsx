'use client';

import React, { useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';
import { yCollab } from 'y-codemirror.next';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';

// --- THE OBSIDIAN "HIDE SYMBOLS" PLUGIN ---
const obsidianLivePreview = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = this.getDeco(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet) this.decorations = this.getDeco(update.view);
    }
    getDeco(view: EditorView) {
      const builder = new RangeSetBuilder<Decoration>();
      const selection = view.state.selection.main;
      const line = view.state.doc.lineAt(selection.from);

      for (const { from, to } of view.visibleRanges) {
        syntaxTree(view.state).iterate({
          from,
          to,
          enter: node => {
            // Hide symbols if the cursor is NOT on this line
            if (node.from < line.from || node.to > line.to) {
              const marks = ['HeaderMark', 'EmphasisMark', 'StrongMark', 'LinkMark', 'CodeMark', 'FencedCode'];
              if (marks.includes(node.name)) {
                builder.add(node.from, node.to, Decoration.replace({}));
              }
            }
          },
        });
      }
      return builder.finish();
    }
  },
  { decorations: v => v.decorations }
);

export function MarkdownSection({ node }: { node: any }) {
  const { data: session } = useSession();

  // 1. Initialize Yjs types
  const ydoc = useMemo(() => new Y.Doc(), [node._id]);
  const yText = useMemo(() => ydoc.getText('codemirror'), [ydoc]);

  // 2. Initialize Hocuspocus Provider
  const provider = useMemo(() => {
    return new HocuspocusProvider({
      url: 'ws://localhost:1234',
      name: node._id,
      document: ydoc,
    });
  }, [node._id, ydoc]);

  // 3. User Identity & Cleanup (Prevents Ghost Cursors)
  useEffect(() => {
    if (session?.user) {
      provider.awareness.setLocalStateField('user', {
        name: session.user.name || session.user.email,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      });
    }
    return () => {
      // Standard Practice: Total cleanup on unmount
      provider.destroy();
      ydoc.destroy();
    };
  }, [session, provider, ydoc]);

  // 4. CodeMirror Extensions
  const extensions = useMemo(
    () => [
      markdown({ base: markdownLanguage }),
      yCollab(yText, provider.awareness),
      obsidianLivePreview,
      EditorView.lineWrapping,
      EditorView.theme({
        '&': { height: '100%', backgroundColor: 'transparent' },
        '.cm-content': { padding: '24px', fontFamily: 'inherit' },
        '.cm-ySelectionInfo': {
          // Cursor labels
          padding: '2px 4px',
          fontSize: '10px',
          borderRadius: '4px',
          color: 'white',
          fontWeight: 'bold',
        },
      }),
    ],
    [yText, provider]
  );

  return (
    <div className="h-full w-full bg-background border-none outline-none">
      <CodeMirror
        height="100%"
        extensions={extensions}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
        }}
        // NOTE: No 'value' or 'onChange' prop here.
        // yCollab handles the sync automatically.
      />
    </div>
  );
}
