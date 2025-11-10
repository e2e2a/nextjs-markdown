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

interface ContainerProps {
  children: ReactNode;
  itemType: string;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  setFile: React.Dispatch<React.SetStateAction<{ name: string; oldName?: string; type: string }>>;
  //** For updating */
  node: INode | null;
  active: Partial<INode> | null;
  setActive: React.Dispatch<React.SetStateAction<Partial<INode> | null>>;
  updateNode: boolean;
  setUpdateNode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SidebarContextMenu({
  children,
  itemType,
  setIsCreating,
  setFile,
  node,
  active,
  setActive,
  updateNode,
  setUpdateNode,
  setIsOpen,
}: ContainerProps) {
  return (
    <ContextMenu modal={true}>
      <ContextMenuTrigger className="min-h-full max-h-full h-full" asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent
        onClick={e => e.preventDefault()}
        onContextMenu={e => e.preventDefault()}
        className="w-52"
      >
        {(!itemType || itemType === 'folder') && (
          <>
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
          </>
        )}

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
              onClick={e => {
                e.stopPropagation();
                setUpdateNode(val => !val);
                setActive(node ? node : null);
                setFile({ name: node.title!, oldName: node.title!, type: node.type });
              }}
              inset
            >
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              className="hover:bg-red-200 focus:bg-red-300 cursor-pointer p-0 px-0 w-full"
              onClick={e => e.preventDefault()}
              // onContextMenu={e => e.preventDefault()}
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
