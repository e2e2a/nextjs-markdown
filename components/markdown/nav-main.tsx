'use client';
import { useRef, DragEvent } from 'react';
import { useParams } from 'next/navigation';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { groupNodes } from '@/utils/node-utils';
import { useNodesProjectIdQuery } from '@/hooks/node/useNodeQuery';
import { SidebarGroup } from '@/components/ui/sidebar';
import SidebarItem from '../project/nodes/sidebar-item';
import { INode } from '@/types';
import { cn } from '@/lib/utils';
import SidebarCreateFolderItem from '../project/nodes/sidebar-create-folder-item';
import SidebarCreateFileItem from '../project/nodes/sidebar-create-file-item';
export function clearAllFolderDragOver() {
  document.querySelectorAll('[data-drag-over]').forEach(el => el.removeAttribute('data-drag-over'));
}
export function NavMain() {
  const params = useParams();
  const pid = params.pid as string;
  const { data: nData, isLoading: nLoading } = useNodesProjectIdQuery(pid);
  const { isCreating, activeDrag, setActiveDrag } = useNodeStore();

  // Ref for the final drop logic to avoid unnecessary re-renders
  const targetIdRef = useRef<string | null>(null);

  if (nLoading) return <div>Loading...</div>;
  const { folders, files } = groupNodes(nData?.nodes || []);

  const handleDragFinished = (dragged: INode | null) => {
    if (dragged && targetIdRef.current) {
      console.log(`Moving ${dragged.title} -> ${targetIdRef.current}`);
      // API Call here
    }
    setActiveDrag(null);
    targetIdRef.current = null;
  };

  const isCreatingAtRoot = isCreating && isCreating.parentId === null;

  const commonDragEvents = {
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      const targetId = 'root';
      // Clear previous hover if it's a different node
      if (targetIdRef.current !== targetId) {
        clearAllFolderDragOver();
        targetIdRef.current = targetId;
      }

      const el = document.querySelector(`[data-id="${targetId}"]`) as HTMLElement | null;
      el?.setAttribute('data-drag-over', 'true');
    },

    onDragLeave: (e: DragEvent) => {
      console.log('asd');
      e.preventDefault();
      clearAllFolderDragOver();
    },

    onDragEnter: (e: DragEvent) => e.preventDefault(),
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      // e.stopPropagation();
    },
  };

  return (
    <div
      // data-id="root" we remove this id. and rely to the children root id. if that root is drag-over=true this parent will have the style
      className={cn(
        'h-full w-full flex flex-col group/nodes-border-level',
        activeDrag &&
          activeDrag.parentId &&
          'has-[[data-id="root"][data-drag-over="true"]]:bg-accent/50 has-[[data-id="root"][data-drag-over="true"]]:ring-1 has-[[data-id="root"][data-drag-over="true"]]:ring-inset has-[[data-id="root"][data-drag-over="true"]]:ring-accent'
      )}
    >
      {/* Scrollable sidebar content */}
      <SidebarGroup className="flex-1 flex flex-col p-0 overflow-y-auto">
        {/* Items at root */}
        {isCreatingAtRoot && isCreating.type === 'folder' && <SidebarCreateFolderItem depth={0} />}
        {folders.map(item => (
          <SidebarItem
            key={item._id}
            item={item}
            depth={0}
            targetIdRef={targetIdRef}
            activeDrag={activeDrag}
            onDragStart={setActiveDrag}
            onDragEnd={handleDragFinished}
          />
        ))}

        {isCreatingAtRoot && isCreating.type === 'file' && <SidebarCreateFileItem depth={2} />}
        {files.map(item => (
          <SidebarItem
            key={item._id}
            item={item}
            depth={0}
            targetIdRef={targetIdRef}
            activeDrag={activeDrag}
            onDragStart={setActiveDrag}
            onDragEnd={handleDragFinished}
          />
        ))}

        {/* Flexible spacer at the bottom */}
        <div data-id="root" className="flex-1 w-full min-h-3" {...commonDragEvents} />
      </SidebarGroup>
    </div>
  );
}
