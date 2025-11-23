'use client';
import * as Y from 'yjs';
import { useEffect, useRef, useState, useCallback } from 'react';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from 'codemirror';
import { yCollab } from 'y-codemirror.next';
import { setupMarkdownSupabase } from '@/lib/setup-markdown-supabase';
import { Awareness } from 'y-protocols/awareness.js';
import { INode } from '@/types';
import { Session } from 'next-auth';
import { useMarkdownEditorConfig } from '@/lib/useMarkdownEditorConfig';
import ReactMarkdown from 'react-markdown';
import { useNodeMutations } from '@/hooks/node/useNodeMutations';
import { UseMutationResult } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { timeAgo } from '@/lib/timeAgo';

interface MarkdownSectionProps {
  node: INode;
  session: Session;
}

interface EditorDependencies {
  ytext: Y.Text;
  awareness: Awareness;
  key: string;
  initialContent: string;
}

const docsCache = new Map<string, ReturnType<typeof setupMarkdownSupabase>>();

function getOrCreateNodeDoc(
  node: INode,
  session: Session,
  update: UseMutationResult,
  setLoading: React.Dispatch<boolean>
) {
  if (!docsCache.has(node._id)) {
    const created = setupMarkdownSupabase(node, session, node?.content || '', update);
    docsCache.set(node._id, created);
    setTimeout(() => {
      setLoading(false);
    }, 250);
  } else {
    setLoading(false);
  }
  return docsCache.get(node._id)!;
}

export function MarkdownSection({ node, session }: MarkdownSectionProps) {
  const mutation = useNodeMutations();

  // Keep 'content' ONLY for the preview
  const [content, setContent] = useState(node?.content || '');
  const editorRef = useRef<EditorView | null>(null);
  const [deps, setDeps] = useState<EditorDependencies | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const handleSelectionComment = useCallback((selection: string) => {
    if (!selection) {
      alert('Select text first.');
      return;
    }
    alert(`Added comment to: "${selection}"`);
  }, []);

  const { extensions: markdownExtensions } = useMarkdownEditorConfig(
    handleSelectionComment,
    setIsPreview
  );

  useEffect(() => {
    if (!node) return;
    const docObj = getOrCreateNodeDoc(
      node,
      session,
      mutation.update as UseMutationResult,
      setLoading
    );

    const { ytext, awareness, checkConnection } = docObj;

    checkConnection();

    const currentContent = ytext.toString();

    const onYtextUpdate = () => {
      setContent(ytext.toString());
    };
    ytext.observe(onYtextUpdate);

    const animationFrameId = requestAnimationFrame(() => {
      setDeps({
        ytext,
        awareness,
        key: node._id,
        initialContent: currentContent,
      });
      setContent(currentContent);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      ytext.unobserve(onYtextUpdate);
      editorRef.current = null;
      setDeps(null);
      setContent('');
      setIsPreview(false);
    };
  }, [node, session]);

  if (!deps) {
    return <div className="p-4 text-sm text-gray-500">Loading editor...</div>;
  }

  if (loading) return <div className="p-4 text-sm text-gray-500">Loading editor...</div>;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }} className="min-w-full overflow-hidden">
        {!isPreview && (
          <CodeMirror
            key={deps.key}
            // value={deps.initialContent}
            value={content}
            className=" overflow-hidden min-w-full"
            basicSetup={false}
            extensions={[
              ...markdownExtensions,
              basicSetup,
              yCollab(deps.ytext, deps.awareness),
              EditorView.lineWrapping,
            ]}
            onChange={val => setContent(val)}
            onCreateEditor={view => (editorRef.current = view)}
          />
        )}

        {isPreview && (
          <div
            className="prose max-w-none overflow-auto px-2 bg-white text-black"
            style={{ height: '100%' }}
          >
            <div className="h-5 flex justify-between items-center my-2">
              <div className="text-black">Changed: {timeAgo(node.updatedAt!)}</div>
              <div className="">
                <Button
                  onClick={() => setIsPreview(false)}
                  className="bg-transparent text-black hover:bg-transparent focus:bg-none drop-shadow-none focus-visible:ring-0 border-none cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="editor-preview">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
