'use client';
import React, { useMemo, useState, DragEvent } from 'react';
import { cn } from '@/lib/utils';
import { INode } from '@/types';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { groupNodes } from '@/utils/node-utils';
import SidebarFileItem from './sidebar-file-item';
import SidebarFolderItem from './sidebar-folder-item';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { SidebarMenu, SidebarGroupContent } from '../../ui/sidebar';
import { SidebarContextMenu } from '../../markdown/sidebar-context-menu';

function clearAllFolderDragOver() {
  document.querySelectorAll('[data-drag-over]').forEach(el => el.removeAttribute('data-drag-over'));
}
function getHighlightTargetId(item: INode) {
  if (item.type === 'file') {
    if (!item.parentId) return 'root';
    return item.parentId ?? item._id;
  }

  return item._id;
}

interface IProps {
  item: INode;
  depth: number;
  targetIdRef: React.RefObject<string | null>;
  activeDrag: INode | null;
  activeOver: INode | null;
  isParentDragging?: boolean;
  onDragStart: (node: INode) => void;
  onDragEnd: (dragged: INode | null) => void;
}

export default function SidebarItem({
  item,
  depth,
  activeDrag,
  activeOver,
  targetIdRef,
  isParentDragging = false,
  onDragStart,
  onDragEnd,
}: IProps) {
  const { isUpdatingNode } = useNodeStore();
  const [isOpen, setIsOpen] = useState(false);

  // 2. Relation Logic
  const isDirectTarget = activeDrag?._id === item._id;
  const isInForbiddenZone = isDirectTarget || isParentDragging;

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(item);

    // Create simple ghost image
    const dragImage = document.createElement('div');
    dragImage.innerText = item.title || 'Moving...';
    dragImage.style.cssText =
      'position:absolute; top:-1000px; padding:6px 10px; background:#000; color:#fff; border-radius:4px; font-size:12px; z-index:1000;';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);

    // Clean up the ghost DOM node after the drag starts
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);
  };

  const { folders, files } = useMemo(() => groupNodes(item.children || []), [item.children]);

  const commonDragEvents = {
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      const targetId = getHighlightTargetId(item);
      // Clear previous hover if it's a different node
      if (targetIdRef.current !== targetId) {
        clearAllFolderDragOver();
        targetIdRef.current = targetId;
      }

      const el = document.querySelector(`[data-id="${targetId}"]`) as HTMLElement | null;
      el?.setAttribute('data-drag-over', 'true');
    },

    onDragLeave: (e: DragEvent) => {
      e.preventDefault();

      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (!relatedTarget || !relatedTarget.closest(`[data-id="${targetIdRef.current}"]`)) {
        targetIdRef.current = null;
        clearAllFolderDragOver();
      }
    },
    onDragEnter: (e: DragEvent) => e.preventDefault(),
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isInForbiddenZone) {
        onDragEnd(item);
      } else {
        onDragEnd(null);
      }
      clearAllFolderDragOver();
    },
  };

  // --- FILE RENDERING ---
  if (item.type === 'file') {
    return (
      <div
        draggable="true"
        onDragStart={handleDragStart}
        data-id={item._id}
        {...commonDragEvents}
        className={cn('relative w-full transition-colors duration-0 select-none ')}
      >
        <SidebarFileItem item={item} depth={depth} />
      </div>
    );
  }

  // --- FOLDER RENDERING ---
  return (
    <SidebarMenu className="gap-0 p-0">
      <Collapsible
        open={isOpen}
        onOpenChange={isUpdatingNode?._id === item._id ? undefined : setIsOpen}
        data-id={item._id}
        className={cn(
          'transition-none',
          !isInForbiddenZone && activeDrag?.parentId !== item._id
            ? 'data-[drag-over=true]:bg-accent/50 data-[drag-over=true]:ring-1 data-[drag-over=true]:ring-inset data-[drag-over=true]:ring-accent'
            : ''
        )}
      >
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              'group/folder-row relative w-full transition-colors duration-0 cursor-pointer pointer-events-auto!'
            )}
            draggable="true"
            onDragStart={handleDragStart}
            {...commonDragEvents}
          >
            <SidebarContextMenu node={item}>
              <SidebarFolderItem item={item} isOpen={isOpen} depth={depth} />
            </SidebarContextMenu>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="relative transition-none">
          <div
            aria-hidden
            className="absolute left-0 top-0 bottom-0 w-px bg-border"
            style={{ left: (depth + 1) * 8 }}
          />

          <SidebarGroupContent className={cn('transition-none duration-0 gap-0! space-y-0! p-0!')}>
            <SidebarMenu className={cn(' gap-0! space-y-0! p-0!')}>
              {folders.map(child => (
                <SidebarItem
                  key={child._id}
                  item={child}
                  depth={depth + 1}
                  activeDrag={activeDrag}
                  activeOver={activeOver}
                  targetIdRef={targetIdRef}
                  isParentDragging={isInForbiddenZone}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                />
              ))}
              {files.map(child => (
                <SidebarItem
                  key={child._id}
                  item={child}
                  depth={depth + 3}
                  activeDrag={activeDrag}
                  activeOver={activeOver}
                  targetIdRef={targetIdRef}
                  isParentDragging={isInForbiddenZone}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenu>
  );
}
