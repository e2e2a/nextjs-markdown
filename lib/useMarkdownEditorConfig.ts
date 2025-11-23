import React, { useMemo } from 'react';
import { EditorView } from '@codemirror/view';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap, Command } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import toolbar from 'codemirror-toolbar';
import * as Items from 'codemirror-toolbar/items';
import * as MarkdownItems from 'codemirror-toolbar/items/markdown';
import { Code, Eye, Fullscreen, Image, MessageSquare } from 'lucide-react';
import { getLucideIconSvg } from '@/lib/get-lucide-icon-svg';

const customToolbarStyles = EditorView.theme({
  '.codemirror-toolbar__item:hover': {
    backgroundColor: '#e2e8f0 !important',
    color: '#000000 !important',
    borderRadius: '4px',
  },
});

const createCodeBlockCommand: Command = (view: EditorView) => {
  const { state, dispatch } = view;
  const range = state.selection.main;
  const text = state.sliceDoc(range.from, range.to);

  let newText: string;
  let newAnchor: number;

  if (text.length > 0) {
    newText = '```bash\n' + text + '\n```';
    newAnchor = range.from + newText.length;
  } else {
    const placeholder = '```bash\n\n```';
    newText = placeholder;
    newAnchor = range.from + '```bash\n'.length;
  }

  dispatch({
    changes: { from: range.from, to: range.to, insert: newText },
    selection: { anchor: newAnchor },
  });
  return true;
};

const toggleFullscreenCommand: Command = (view: EditorView) => {
  const editorElement = view.dom;
  if (!document.fullscreenElement) {
    editorElement.requestFullscreen().catch(err => {
      console.error(`Error enabling full-screen: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
  return true;
};

export const useMarkdownEditorConfig = (
  handleSelectionComment: (selection: string) => void,
  setIsPreview: React.Dispatch<boolean>
) => {
  const memoizedCommentCommand: Command = useMemo(() => {
    return (view: EditorView) => {
      if (!handleSelectionComment) return false;
      const selection = view.state.sliceDoc(
        view.state.selection.main.from,
        view.state.selection.main.to
      );
      if (selection) handleSelectionComment(selection);
      return true;
    };
  }, [handleSelectionComment]);

  const extensions = useMemo(() => {
    const customPreviewToggleItem = {
      label: 'Toggle Preview',
      command: () => {
        // can use view: EditorView
        setIsPreview(true);
        return true;
      },
      icon: getLucideIconSvg(Eye),
      key: 'preview-toggle',
    };

    const customCodeBlockItem = {
      label: 'Code Block',
      icon: getLucideIconSvg(Code),
      command: createCodeBlockCommand,
      key: 'code',
    };

    const customFullscreenItem = {
      label: 'Fullscreen',
      icon: getLucideIconSvg(Fullscreen),
      command: toggleFullscreenCommand,
      key: 'Fullscreen',
    };

    const customCommentItem = {
      label: 'Comment',
      icon: getLucideIconSvg(MessageSquare),
      command: memoizedCommentCommand,
      key: 'Comment',
    };

    const customImageItem = {
      ...MarkdownItems.image,
      icon: getLucideIconSvg(Image),
      command: (view: EditorView) => {
        const imageTemplate = '![Alt Text](URL)';
        const { state, dispatch } = view;
        const range = state.selection.main;

        dispatch({
          changes: { from: range.from, to: range.to, insert: imageTemplate },
          selection: { anchor: range.from + 2, head: range.from + 10 },
        });
        return true;
      },
      key: 'image',
    };

    // --- Extension Array ---
    return [
      oneDark,
      markdown({ base: markdownLanguage }),
      customToolbarStyles,

      keymap.of(defaultKeymap),
      // EditorView.lineWrapping,

      toolbar({
        items: [
          MarkdownItems.bold,
          MarkdownItems.italic,
          MarkdownItems.strike,
          MarkdownItems.underline,
          Items.split,

          MarkdownItems.h1,
          MarkdownItems.h2,
          Items.split,

          MarkdownItems.quote,
          MarkdownItems.ul,
          MarkdownItems.ol,
          MarkdownItems.todo,
          Items.split,

          customCodeBlockItem,
          customImageItem,
          Items.split,

          customCommentItem,
          Items.space,
          customPreviewToggleItem,
          customFullscreenItem,
        ],
      }),
    ];
  }, [setIsPreview, memoizedCommentCommand]);

  return { extensions };
};
