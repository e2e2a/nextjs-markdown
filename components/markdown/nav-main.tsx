'use client';
import { useRef, DragEvent, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { groupNodes } from '@/utils/client/node-utils';
import { useNodesProjectIdQuery } from '@/hooks/node/useNodeQuery';
import { SidebarGroup } from '@/components/ui/sidebar';
import SidebarItem from '../project/nodes/sidebar-item';
import { INode } from '@/types';
import { cn } from '@/lib/utils';
import SidebarCreateFolderItem from '../project/nodes/sidebar-create-folder-item';
import SidebarCreateFileItem from '../project/nodes/sidebar-create-file-item';
import { makeToastError } from '@/lib/toast';
import { useNodeMutations } from '@/hooks/node/useNodeMutations';
import { sortNodeTree } from '@/utils/client/sortNode';
// import { sortNodeTree } from '@/modules/projects/nodes/node.service';
export function clearAllFolderDragOver() {
  document.querySelectorAll('[data-drag-over]').forEach(el => el.removeAttribute('data-drag-over'));
}
export function NavMain() {
  const params = useParams();
  const pid = params.pid as string;
  const { data: nData, isLoading: nLoading } = useNodesProjectIdQuery(pid);
  const { nodes, isCreating, activeDrag, setActiveDrag, setNodes, moveNode, undo } = useNodeStore();

  const mutation = useNodeMutations();

  const nodesById = useMemo(() => {
    const map: Record<string, INode> = {};
    const walk = (list?: INode[]) => {
      if (!list) return;
      for (const n of list) {
        map[n._id] = n;
        walk(n.children);
      }
    };
    walk(nodes ?? []);
    return map;
  }, [nodes]);

  useEffect(() => {
    if (!nData && (!nData?.nodes || nData?.nodes?.length <= 0)) return;
    setNodes(nData?.nodes);
  }, [nData, setNodes]);

  useEffect(() => {
    if (!nodes || nodes?.length <= 0) return;
    const result = sortNodeTree(nodes);
    setNodes(result);
  }, [nodes, setNodes]);

  // Ref for the final drop logic to avoid unnecessary re-renders
  const targetIdRef = useRef<string | null>(null);

  if (nLoading) return <div>Loading...</div>;
  const { folders, files } = groupNodes(nodes || []);

  const handleDragFinished = () => {
    const dragged = activeDrag;
    const targetId = targetIdRef.current;

    setActiveDrag(null);
    targetIdRef.current = null;

    if (!dragged || !targetId) return; // invalid drop
    if (targetId === 'root' && dragged.parentId === null) return; // invalid drop

    try {
      moveNode(dragged._id, targetId);

      requestAnimationFrame(() => {
        document.getElementById('sidebar-tree-nodes')?.focus();
      });

      mutation.move.mutate(
        { _id: dragged._id, pid: dragged.projectId, parentId: targetId === 'root' ? null : targetId },
        {
          onError: async err => {
            try {
              undo();
              makeToastError(err.message);
            } catch {}
            return;
          },
        }
      );
    } catch (err) {
      let message = 'Unknown Error';
      if (err instanceof Error) {
        message = err.message;
      } else {
        message = err as string;
      }
      makeToastError(message);
      try {
        undo();
      } catch {}
    }
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
      e.preventDefault();
      clearAllFolderDragOver();
    },

    onDragEnter: (e: DragEvent) => e.preventDefault(),
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      // e.stopPropagation();
      clearAllFolderDragOver();
      handleDragFinished();
    },
  };

  return (
    <div
      className={cn(
        'h-full w-full flex flex-col group/nodes-border-level',
        activeDrag &&
          activeDrag.parentId &&
          'has-[[data-id="root"][data-drag-over="true"]]:bg-accent/50 has-[[data-id="root"][data-drag-over="true"]]:ring-1 has-[[data-id="root"][data-drag-over="true"]]:ring-inset has-[[data-id="root"][data-drag-over="true"]]:ring-accent'
      )}
    >
      <SidebarGroup className="flex-1 flex flex-col p-0 overflow-y-auto">
        {isCreatingAtRoot && isCreating.type === 'folder' && <SidebarCreateFolderItem depth={0} />}
        {folders.map(item => (
          <SidebarItem
            key={item._id}
            item={item}
            nodesById={nodesById}
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
            nodesById={nodesById}
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
