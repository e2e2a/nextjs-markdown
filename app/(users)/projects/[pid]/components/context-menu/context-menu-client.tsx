import React, { useEffect, useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { EditorView } from '@uiw/react-codemirror';
import GeneralContextMenu from './general';
interface IProps {
  children: React.ReactNode;
  editorViewRef: React.RefObject<EditorView | null>;
  synced: boolean;
  contextType: 'general' | 'callout' | 'blockquote' | 'mermaid';
  setContextType: React.Dispatch<'general' | 'callout' | 'blockquote' | 'mermaid'>;
}
const ContextMenuClient = ({ editorViewRef, synced, contextType, setContextType, children }: IProps) => {
  const [currentLineText, setCurrentLineText] = useState('');
  const [cursorPos, setCursorPos] = useState(0);

  useEffect(() => {
    const handleContext = (e: CustomEvent<'general' | 'callout' | 'blockquote' | 'mermaid'>) => setContextType(e.detail);
    window.addEventListener('set-editor-context', handleContext);
    return () => window.removeEventListener('set-editor-context', handleContext);
  }, [setContextType]);

  const handleMenuOpen = (open: boolean) => {
    if (open && editorViewRef.current) {
      const view = editorViewRef.current;
      const { head } = view.state.selection.main;
      const line = view.state.doc.lineAt(view.state.selection.main.head);

      setCurrentLineText(line.text); // Capture the "Snapshot"
      setCursorPos(head - line.from); // Capture relative cursor position
    }
  };
  return (
    <ContextMenu onOpenChange={handleMenuOpen}>
      <ContextMenuTrigger disabled={!synced} className="block h-full w-full">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56 bg-background border-white/10 shadow-2xl">
        <ContextMenuGroup>
          {contextType === 'mermaid' && (
            <>
              <ContextMenuItem onClick={() => console.log('Export SVG')}>Export Diagram as SVG</ContextMenuItem>
              <ContextMenuItem onClick={() => console.log('Copy Mermaid Code')}>Copy Mermaid Code</ContextMenuItem>
              <ContextMenuSeparator />
            </>
          )}

          {contextType === 'blockquote' && <ContextMenuItem>Convert to Callout</ContextMenuItem>}
          {contextType === 'general' && <GeneralContextMenu editorViewRef={editorViewRef} currentLineText={currentLineText} cursorPos={cursorPos} />}
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ContextMenuClient;
