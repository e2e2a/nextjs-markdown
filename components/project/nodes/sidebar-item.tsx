'use client';
import React, { useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { SidebarGroupContent, SidebarMenu } from '../../ui/sidebar';
import { SidebarContextMenu } from '../../markdown/sidebar-context-menu';
import { cn } from '@/lib/utils';
import { INode } from '@/types';
import { useNodeStore } from '@/features/editor/stores/nodes';
import SidebarFileItem from './sidebar-file-item';
import SidebarCreateFileItem from './sidebar-create-file-item';
import { groupNodes } from '@/utils/node-utils';
import SidebarCreateFolderItem from './sidebar-create-folder-item';
import SidebarFolderItem from './sidebar-folder-item';

interface IProps {
  item: INode;
  depth: number;
}

export default function SidebarItem({ item, depth }: IProps) {
  const localStorageKey = `sidebar-folder-open-${item._id}`;
  const { isCreating, collapseVersion, isUpdatingNode } = useNodeStore();
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem(localStorageKey) === 'true';
    } catch {
      return false;
    }
  });
  const [prevVersion, setPrevVersion] = useState(collapseVersion);

  if (collapseVersion !== prevVersion) {
    setPrevVersion(collapseVersion);
    setIsOpen(false);
  }

  useEffect(() => {
    localStorage.setItem(localStorageKey, String(isOpen));
  }, [localStorageKey, isOpen]);
  const isCreatingHere = isCreating && isCreating.parentId === item._id;
  const { folders, files } = groupNodes(item.children);
  if (item.type === 'file') {
    return (
      <SidebarContextMenu node={item}>
        <div
          className={cn(
            'flex text-sidebar-foreground/70 font-medium text-sm rounded-none focus:outline-none outline-none focus:ring-0'
          )}
        >
          <SidebarFileItem item={item} depth={!item.parentId ? depth + 2 : depth} />
        </div>
      </SidebarContextMenu>
    );
  }

  return (
    <>
      <SidebarMenu className="gap-0! p-0! ">
        <Collapsible
          key={item.title}
          open={isOpen}
          onOpenChange={isUpdatingNode?._id === item._id ? undefined : setIsOpen}
          className="leading-none"
        >
          <CollapsibleTrigger disabled={isUpdatingNode?._id === item._id} asChild>
            <div className="w-full focus:outline-none gap-0 cursor-pointer">
              <SidebarContextMenu node={item}>
                <div className="">
                  <SidebarFolderItem item={item} isOpen={isOpen} depth={depth} />
                </div>
              </SidebarContextMenu>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* 1. NEW FOLDER INPUT (at top of nested folders) */}
                {isCreatingHere && isCreating.type === 'folder' && (
                  <SidebarCreateFolderItem depth={depth + 2} />
                )}

                {/* 2. EXISTING NESTED FOLDERS */}
                {folders.map((child, i) => (
                  <div key={i}>
                    <SidebarItem key={child._id} item={child} depth={depth + 2} />
                  </div>
                ))}

                {/* 3. NEW FILE INPUT (at top of nested files, after folders) */}
                {isCreatingHere && isCreating.type === 'file' && (
                  <SidebarCreateFileItem depth={depth + 2} />
                )}

                {/* 4. EXISTING NESTED FILES */}
                {files.map((child, i) => (
                  <div key={i}>
                    <SidebarItem key={child._id} item={child} depth={depth + 2} />
                  </div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
    </>
  );
}
