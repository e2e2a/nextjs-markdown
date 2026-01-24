'use client';

import React, { useEffect, useState, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';
import { yCollab } from 'y-codemirror.next';

export function MarkdownSection({ node }: { node: any }) {
  const ydoc = useMemo(() => new Y.Doc(), [node._id]);
  const yText = useMemo(() => ydoc.getText('codemirror'), [ydoc]);
  const [isSynced, setIsSynced] = useState(false);

  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: 'ws://localhost:1234',
        name: `node-${node._id}`,
        document: ydoc,
        onSynced: () => setIsSynced(true),
      }),
    [ydoc, node._id]
  );

  // --- THE "OBSIDIAN" EXTENSION ---
  // This hides markdown syntax (like ** or ```) UNLESS the cursor is on that line.
  const obsidianLivePreview = useMemo(
    () =>
      ViewPlugin.fromClass(
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

            for (const { from, to } of view.visibleRanges) {
              syntaxTree(view.state).iterate({
                from,
                to,
                enter: node => {
                  // Logic: If node is "Markdown Symbols" and NOT inside the current cursor line
                  // then apply a "display: none" or "opacity: 0" decoration.
                  const isCursorOnLine = selection.from >= view.state.doc.lineAt(node.from).from && selection.to <= view.state.doc.lineAt(node.to).to;

                  if (!isCursorOnLine && (node.name === 'EmphasisMark' || node.name === 'HeaderMark')) {
                    builder.add(node.from, node.to, Decoration.replace({}));
                  }
                },
              });
            }
            return builder.finish();
          }
        },
        { decorations: v => v.decorations }
      ),
    []
  );

  const extensions = useMemo(
    () => [
      yCollab(yText, provider.awareness),
      obsidianLivePreview,
      EditorView.lineWrapping,
      // Add your existing markdown extensions here
    ],
    [yText, provider, obsidianLivePreview]
  );

  if (!isSynced) return <div>Loading source of truth...</div>;

  return (
    <CodeMirror
      value={yText.toString()} // Initial value only
      extensions={extensions}
      basicSetup={{ lineNumbers: false }}
      className="h-full"
    />
  );
}
