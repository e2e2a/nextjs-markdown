'use client';
import React, { useEffect, useState, DragEvent } from 'react';
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
  isParentDragging?: boolean;
  onDragStart: (node: INode) => void;
  onDragEnd: (dragged: INode | null) => void;
}
interface IProps {
  item: INode;
  depth: number;
}

export default function SidebarItem({
  item,
  depth,
  activeDrag,
  targetIdRef,
  isParentDragging = false,
  onDragStart,
  onDragEnd,
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
  const [prevVersion, setPrevVersion] = useState(collapseVersion);

  if (collapseVersion !== prevVersion) {
    setPrevVersion(collapseVersion);
    setIsOpen(false);
  }

  useEffect(() => {
    localStorage.setItem(localStorageKey, String(isOpen));
  }, [localStorageKey, isOpen]);
  const isCreatingHere = isCreating && isCreating.parentId === item._id;

  const isDirectTarget = activeDrag?._id === item._id;
  const isInForbiddenZone = isDirectTarget || isParentDragging;

  useEffect(() => {
    if (isCreatingHere)
      requestAnimationFrame(() => {
        setIsOpen(true);
      });
  }, [isCreatingHere]);

  const { folders, files } = groupNodes(item.children);
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

  if (item.type === 'file') {
    return (
      <SidebarContextMenu node={item}>
        <div
          onDragStart={handleDragStart}
          draggable="true"
          data-id={item._id}
          {...commonDragEvents}
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
          className={cn(
            'transition-none leading-none',
            !isInForbiddenZone && activeDrag?.parentId !== item._id
              ? 'data-[drag-over=true]:bg-accent/50 data-[drag-over=true]:ring-1 data-[drag-over=true]:ring-inset data-[drag-over=true]:ring-accent'
              : ''
          )}
        >
          <CollapsibleTrigger disabled={isUpdatingNode?._id === item._id} asChild>
            <div
              className="w-full focus:outline-none gap-0 cursor-pointer"
              onDragStart={handleDragStart}
              draggable="true"
              data-id={item._id}
              {...commonDragEvents}
            >
              <SidebarContextMenu node={item}>
                <div className="">
                  <SidebarFolderItem item={item} isOpen={isOpen} depth={depth} />
                </div>
              </SidebarContextMenu>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0! space-y-0! p-0!">
                {isCreatingHere && isCreating.type === 'folder' && (
                  <SidebarCreateFolderItem depth={depth + 2} />
                )}
                {folders.map(child => (
                  <SidebarItem
                    key={child._id}
                    item={child}
                    depth={depth + 1}
                    activeDrag={activeDrag}
                    targetIdRef={targetIdRef}
                    isParentDragging={isInForbiddenZone}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                ))}
                {isCreatingHere && isCreating.type === 'file' && (
                  <SidebarCreateFileItem depth={depth + 3} />
                )}
                {files.map(child => (
                  <SidebarItem
                    key={child._id}
                    item={child}
                    depth={depth + 3}
                    activeDrag={activeDrag}
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
    </>
  );
}
