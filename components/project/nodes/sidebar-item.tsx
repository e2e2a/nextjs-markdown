'use client';
import React, { useMemo, memo, useState, useEffect } from 'react';
import { Active, useDndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { INode } from '@/types';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { groupNodes } from '@/utils/node-utils';

// Sub-components
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
  active: Active | null;
  isParentDragging?: boolean;
}

function SidebarItemComponent({ item, depth, active, isParentDragging = false }: IProps) {
  const localStorageKey = `sidebar-folder-open-${item._id}`;
  const { isCreating, collapseVersion, isUpdatingNode } = useNodeStore();
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem(localStorageKey) === 'true';
    } catch {
      return false;
    }
  });

  const activeId = active?.id;
  const activeData = active?.data?.current;

  const isAncestorOfActive = useMemo(() => {
    if (!activeData?.parentId) return false;
    if (activeData && activeData.parentId === item._id) return true;
  }, [activeData, item._id]);

  // 1. Data stability
  const dndData = useMemo(
    () => ({
      id: item._id,
      type: item.type,
      title: item.title,
      parentId: item.parentId,
    }),
    [item._id, item.type, item.parentId, item.title]
  );

  // 2. Draggable (The Header only)
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

  // 3. Droppable (The Wrapper)
  // We attach this to the wrapper so the 'rect' includes children.
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: item._id,
    data: dndData,
    // Disable files, dragging node, and children of dragging node
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
  // ... (Keep your existing isOpen / Collapsible logic) ...
  const { folders, files } = useMemo(() => groupNodes(item.children || []), [item.children]);

  // VS Code Pattern: Highlight the folder block if hovered
  const folderContainerStyles = cn(
    'group/folder relative transition-none rounded-sm',
    // This is the "Whole Area" highlight you want
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
    /* CRITICAL: The Droppable Ref goes on this outer DIV. 
       This DIV grows as the Collapsible expands, covering the children's area.
    */
    <div ref={setDroppableRef} className={folderContainerStyles}>
      <SidebarMenu className="gap-0! p-0!">
        <Collapsible
          open={isOpen}
          onOpenChange={isUpdatingNode?._id === item._id ? undefined : setIsOpen}
        >
          {/* Draggable Ref is only on the Trigger (The Folder Header) */}
          <CollapsibleTrigger asChild>
            <div
              ref={setDraggableRef}
              {...attributes}
              {...listeners}
              className={cn(
                'w-full focus:outline-none gap-0 cursor-pointer',
                isDragging && 'opacity-20'
              )}
            >
              <SidebarContextMenu node={item}>
                <div className="w-full">
                  <SidebarFolderItem item={item} isOpen={isOpen} depth={depth} />
                </div>
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
                    active={active}
                    key={child._id}
                    item={child}
                    depth={depth + 2}
                    isParentDragging={isDragging || isParentDragging}
                  />
                ))}
                {isCreatingHere && isCreating.type === 'file' && (
                  <SidebarCreateFileItem depth={depth + 2} />
                )}
                {files.map(child => (
                  <SidebarItem
                    active={active}
                    key={child._id}
                    item={child}
                    depth={depth + 2}
                    isParentDragging={isDragging || isParentDragging}
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

// 5. THE KEY: React.memo with a custom comparator.
// We only want to re-render if the essential props change.
const SidebarItem = memo(SidebarItemComponent, (prev, next) => {
  return (
    prev.item._id === next.item._id &&
    prev.item.children?.length === next.item.children?.length &&
    prev.depth === next.depth &&
    prev.isParentDragging === next.isParentDragging
  );
});

export default SidebarItem;
