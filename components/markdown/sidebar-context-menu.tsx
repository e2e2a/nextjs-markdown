'use client';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { INode } from '@/types';
import { ReactNode } from 'react';
import { DangerConfirmDialog } from '../danger-confirm-dialog';
import { useNodeStore } from '@/features/editor/stores/nodes';

interface ContainerProps {
  children: ReactNode;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  setFile: React.Dispatch<React.SetStateAction<{ name: string; oldName?: string; type: string }>>;
  node: INode | null;
  setActive: React.Dispatch<React.SetStateAction<INode | null>>;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SidebarContextMenu({
  children,
  setIsCreating,
  setFile,
  node,
  setActive,
  setIsOpen,
}: ContainerProps) {
  const { isUpdatingNode, setIsUpdatingNode } = useNodeStore();

  const isUpdatingSelf = !!isUpdatingNode && isUpdatingNode._id === node?._id;
  if (isUpdatingSelf) {
    return (
      <div
        node-editing="true"
        onContextMenu={e => {
          // 1. Stop the event from bubbling up to the Parent ContextMenu
          e.stopPropagation();

          // 2. DO NOT call e.preventDefault() here.
          // This allows the native browser context menu to appear.
        }}
        onMouseDown={e => {
          // prevent parent reset
          e.stopPropagation();
        }}
        className="min-h-full max-h-full h-full"
      >
        {children}
      </div>
    );
  }
  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger className="min-h-full max-h-full h-full w-full" asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent
        onClick={e => e.preventDefault()}
        onContextMenu={e => e.preventDefault()}
        className="w-52"
      >
        <ContextMenuItem
          className="cursor-pointer"
          onMouseDown={e => e.stopPropagation()}
          onClick={e => {
            e.stopPropagation();
            setIsCreating(val => !val);
            if (setIsOpen) setIsOpen(true);
            setActive(node ? node : null);
            setFile(val => ({
              name: val.name,
              oldName: '',
              type: 'file',
            }));
          }}
          inset
        >
          New File
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer"
          onMouseDown={e => e.stopPropagation()}
          onClick={e => {
            e.stopPropagation();
            setIsCreating(val => !val);
            if (setIsOpen) setIsOpen(true);
            setActive(node ? node : null);
            setFile(val => ({
              name: val.name,
              oldName: '',
              type: 'folder',
            }));
          }}
          inset
        >
          New Folder
        </ContextMenuItem>
        <ContextMenuSeparator />

        <ContextMenuItem className="cursor-pointer" inset>
          Cut
        </ContextMenuItem>
        <ContextMenuItem className="cursor-pointer" inset>
          Copy
        </ContextMenuItem>
        <ContextMenuItem className="cursor-pointer" inset>
          Paste
        </ContextMenuItem>
        {node && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="cursor-pointer"
              onMouseDown={e => e.stopPropagation()}
              onClick={() => setIsUpdatingNode(node)}
              inset
            >
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              className="hover:bg-red-200 focus:bg-red-300 cursor-pointer p-0 px-0 w-full"
              onClick={e => e.preventDefault()}
            >
              <DangerConfirmDialog
                triggerTitle="Trash"
                title="Are you absolutely sure?"
                description="This item will be moved to the Trash and kept for 30 days. You can restore it anytime before permanent deletion."
                node={node}
              />
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
