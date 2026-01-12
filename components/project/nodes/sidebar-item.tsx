'use client';
import React, { useEffect, useState, useMemo } from 'react';
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
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDndContext } from '@dnd-kit/core';

interface IProps {
  item: INode;
  depth: number;
  isParentDragging?: boolean; // New prop to track recursive drag state
}

export default function SidebarItem({ item, depth, isParentDragging = false }: IProps) {
  const localStorageKey = `sidebar-folder-open-${item._id}`;
  const { isCreating, collapseVersion, isUpdatingNode } = useNodeStore();
  const { over, active } = useDndContext();

  // Determine if this specific node is the one being dragged
  const isBeingDragged = active?.id === item._id;
  // If this item or any of its parents are dragging, this subtree is "active"
  const isSelfOrParentDragging = isBeingDragged || isParentDragging;

  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: item._id,
    data: { ...item },
    disabled: isSelfOrParentDragging, // Disable interaction if it's the item moving
  });

  const overData = over?.data?.current as INode | undefined;
  const activeData = active?.data?.current as INode | undefined;

  const isTargeted = useMemo(() => {
    if (!active || isSelfOrParentDragging) return false;

    if (over?.id === item._id && item.type === 'folder') return true;

    if (overData?.type === 'file' && overData.parentId === item._id) return true;

    return false;
  }, [active, over, overData, item._id, isSelfOrParentDragging, item.type]);

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

  // --- AUTO-EXPAND ON DRAG OVER ---
  useEffect(() => {
    if (item.type === 'folder' && !isOpen && over?.id === item._id && !isSelfOrParentDragging) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [over?.id, item._id, item.type, isOpen, isSelfOrParentDragging]);

  const isCreatingHere = isCreating && isCreating.parentId === item._id;
  const { folders, files } = groupNodes(item.children);
  const childIds = useMemo(() => item.children?.map(c => c._id) || [], [item.children]);

  // --- STYLES ---
  const dragStyle = {
    opacity: isDragging ? 0.4 : 1,
  };

  // --- FILE RENDER ---
  if (item.type === 'file') {
    return (
      <SidebarContextMenu node={item}>
        <div
          ref={setNodeRef}
          style={dragStyle}
          {...attributes}
          {...listeners}
          className={cn(
            'transition-none flex text-sidebar-foreground/70 font-medium text-sm rounded-none focus:outline-none outline-none focus:ring-0 cursor-pointer bg-transparent',
            isSelfOrParentDragging && 'pointer-events-none' // Disable hover/interaction
          )}
        >
          <SidebarFileItem item={item} depth={!item.parentId ? depth + 2 : depth} />
        </div>
      </SidebarContextMenu>
    );
  }

  // --- FOLDER RENDER ---
  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      className={cn(isSelfOrParentDragging && 'pointer-events-none')}
    >
      <SidebarMenu className="gap-0! p-0!">
        <Collapsible
          key={item._id}
          open={isOpen}
          onOpenChange={isUpdatingNode?._id === item._id ? undefined : setIsOpen}
          className={cn(
            'leading-none transition-none',
            isTargeted ? 'bg-accent/50' : 'bg-transparent'
          )}
        >
          <CollapsibleTrigger asChild>
            <div
              {...attributes}
              {...listeners}
              className="w-full focus:outline-none gap-0 cursor-pointer"
            >
              <SidebarContextMenu node={item}>
                <div>
                  <SidebarFolderItem item={item} isOpen={isOpen} depth={depth} />
                </div>
              </SidebarContextMenu>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
                  {isCreatingHere && isCreating.type === 'folder' && (
                    <SidebarCreateFolderItem depth={depth + 2} />
                  )}

                  {folders.map(child => (
                    <SidebarItem
                      key={child._id}
                      item={child}
                      depth={depth + 2}
                      isParentDragging={isSelfOrParentDragging} // Pass state down
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
                      isParentDragging={isSelfOrParentDragging} // Pass state down
                    />
                  ))}
                </SortableContext>
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
    </div>
  );
}
