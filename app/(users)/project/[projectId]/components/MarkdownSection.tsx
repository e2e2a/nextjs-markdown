import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SimpleMDE from 'easymde';
import dynamic from 'next/dynamic';

import 'easymde/dist/easymde.min.css';
import 'codemirror';
import { INode } from '@/types';
import { useNodeMutations } from '@/hooks/node/useNodeMutations';

interface CMEditorMinimal {
  getSelection(): string;
  on(event: string, handler: () => void): void;
  off(event: string, handler: () => void): void;
}

const SimpleMdeReact = dynamic(() => import('react-simplemde-editor'), { ssr: false });

interface IProps {
  node: INode;
  active: Partial<INode> | null;
}
export default function MarkdownSection({ node, active }: IProps) {
  const [value, setValue] = useState('');
  const cmRef = useRef<CMEditorMinimal | null>(null);
  const selectionRef = useRef<string>('');
  const mutation = useNodeMutations();
  const onChange = (value: string) => {
    setValue(value);
  };

  const updateContent = useCallback(() => {
    if (!node || node.type === 'folder') return;
    const payload = {
      _id: node._id as string,
      content: value,
      type: node.type,
    };

    mutation.update.mutate(payload, {
      onSuccess: () => {
        return;
      },
      onError: () => {
        return;
      },
    });
  }, [value, node, mutation]);
  useEffect(() => {
    if (active && active.type === 'file') {
      requestAnimationFrame(() => {
        setValue(active.content || '');
      });
    }
    return;
  }, [active]);
  useEffect(() => {
    if (!value) return;
    const delay = setTimeout(() => {
      updateContent();
    }, 500);

    return () => clearTimeout(delay);
    return;
  }, [value]);

  const getCmInstanceCallback = useCallback((cmInstance: CMEditorMinimal) => {
    if (!cmInstance) return;
    cmRef.current = cmInstance;

    const handleCursorActivity = () => {
      const selection = cmInstance.getSelection();
      selectionRef.current = selection;
      // if (selection) console.log('Selection updated in ref:', selection);
    };

    cmInstance.on('cursorActivity', handleCursorActivity);

    return () => {
      cmInstance.off('cursorActivity', handleCursorActivity);
    };
  }, []);
  const handleAddComment = useCallback(() => {
    const currentSelection = selectionRef.current;
    if (!currentSelection) {
      alert('Select text first.');
      return;
    }
    // console.log('Adding comment to:', currentSelection);
    alert(`Added comment to: "${currentSelection}"`);
  }, []);

  const autofocusNoSpellcheckerOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      lineNumbers: true,
      placeholder: `Start Typing to dismiss.`,
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
        {
          name: 'comment',
          action: handleAddComment,
          className: 'fa fa-comment',
          title: 'Add Comment',
        },
      ],
    } as SimpleMDE.Options;
  }, [handleAddComment]);

  return (
    <div data-testid="autofocus-no-spellchecker">
      {node ? (
        <SimpleMdeReact
          options={autofocusNoSpellcheckerOptions}
          getCodemirrorInstance={getCmInstanceCallback}
          value={value}
          onChange={setValue}
        />
      ) : (
        <div className="p-5">
          Select a file to start <span className="text-blue-500">editing</span>.
        </div>
      )}
      <style jsx global>{``}</style>
    </div>
  );
}
