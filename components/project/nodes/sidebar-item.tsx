'use client';
import React, { useMemo, memo, useState, useEffect } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { INode } from '@/types';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { groupNodes } from '@/utils/node-utils';

import SidebarFileItem from './sidebar-file-item';
import SidebarFolderItem from './sidebar-folder-item';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { SidebarMenu, SidebarGroupContent } from '../../ui/sidebar';
import { SidebarContextMenu } from '../../markdown/sidebar-context-menu';
import SidebarCreateFolderItem from './sidebar-create-folder-item';
import SidebarCreateFileItem from './sidebar-create-file-item';

interface IProps {
  item: INode;
  depth: number;
  isParentDragging?: boolean;
  activeId?: string;
  activeParentId?: string | null;
}

function SidebarItemComponent({
  item,
  depth,
  isParentDragging = false,
  activeId,
  activeParentId,
}: IProps) {
  const localStorageKey = `sidebar-folder-open-${item._id}`;
  const { isCreating, collapseVersion, isUpdatingNode } = useNodeStore();

  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem(localStorageKey) === 'true';
    } catch {
      return false;
    }
  });

  // ✅ FIXED: always returns boolean
  const isAncestorOfActive = useMemo(() => {
    if (!activeParentId) return false;
    return activeParentId === item._id;
  }, [activeParentId, item._id]);

  const dndData = useMemo(
    () => ({
      id: item._id,
      type: item.type,
      title: item.title,
      parentId: item.parentId,
    }),
    [item]
  );

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    isDragging,
  } = useDraggable({
    id: item._id,
    data: dndData,
    disabled: isParentDragging,
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: item._id,
    data: dndData,
    disabled: item.type === 'file' || activeId === item._id || isParentDragging,
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
  const { folders, files } = useMemo(() => groupNodes(item.children || []), [item.children]);

  const folderContainerStyles = cn(
    'group/folder relative transition-none rounded-sm',
    isOver &&
      !isAncestorOfActive &&
      'bg-accent/50 text-accent-foreground ring-1 ring-inset ring-accent'
  );

  if (item.type === 'file') {
    return (
      <div
        ref={setDraggableRef}
        {...attributes}
        {...listeners}
        className={cn(
          'flex items-center cursor-pointer transition-none select-none',
          isDragging && 'opacity-20',
          isParentDragging && 'pointer-events-none'
        )}
      >
        <SidebarFileItem item={item} depth={!item.parentId ? depth + 2 : depth} />
      </div>
    );
  }

  return (
    <div ref={setDroppableRef} className={folderContainerStyles}>
      <SidebarMenu className="gap-0! p-0!">
        <Collapsible
          open={isOpen}
          onOpenChange={isUpdatingNode?._id === item._id ? undefined : setIsOpen}
        >
          <CollapsibleTrigger asChild>
            <div
              ref={setDraggableRef}
              {...attributes}
              {...listeners}
              className={cn('w-full cursor-pointer', isDragging && 'opacity-20')}
            >
              <SidebarContextMenu node={item}>
                <SidebarFolderItem item={item} isOpen={isOpen} depth={depth} />
              </SidebarContextMenu>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="transition-none!">
            <SidebarGroupContent>
              <SidebarMenu>
                {isCreatingHere && isCreating.type === 'folder' && (
                  <SidebarCreateFolderItem depth={depth + 2} />
                )}

                {folders.map(child => (
                  <SidebarItem
                    key={child._id}
                    item={child}
                    depth={depth + 2}
                    isParentDragging={isDragging || isParentDragging}
                    activeId={activeId}
                    activeParentId={activeParentId}
                  />
                ))}

                {isCreatingHere && isCreating.type === 'file' && (
                  <SidebarCreateFileItem depth={depth + 2} />
                )}

                {files.map(child => (
                  <SidebarItem
                    key={child._id}
                    item={child}
                    depth={depth + 2}
                    isParentDragging={isDragging || isParentDragging}
                    activeId={activeId}
                    activeParentId={activeParentId}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
    </div>
  );
}

const SidebarItem = memo(
  SidebarItemComponent,
  (prev, next) =>
    prev.item._id === next.item._id &&
    prev.item.children?.length === next.item.children?.length &&
    prev.depth === next.depth &&
    prev.isParentDragging === next.isParentDragging &&
    prev.activeId === next.activeId &&
    prev.activeParentId === next.activeParentId
);

export default SidebarItem;
