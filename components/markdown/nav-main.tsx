import { SidebarGroup } from '@/components/ui/sidebar';
import { INode } from '@/types';
import { useNodesProjectIdQuery } from '@/hooks/node/useNodeQuery';
import { useParams } from 'next/navigation';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { groupNodes } from '@/utils/node-utils';
import SidebarCreateFolderItem from '../project/nodes/sidebar-create-folder-item';
import SidebarItem from '../project/nodes/sidebar-item';
import SidebarCreateFileItem from '../project/nodes/sidebar-create-file-item';
import { TreeDndProvider } from '@/features/editor/components/tree-dnd-provider';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

// In a utility file or top of NavMain
export const flattenNodeIds = (nodes: INode[]): string[] => {
  const ids: string[] = [];
  nodes.forEach(node => {
    ids.push(node._id);
    if (node.children && node.children.length > 0) {
      ids.push(...flattenNodeIds(node.children));
    }
  });
  return ids;
};

export function NavMain() {
  const params = useParams();
  const pid = params.pid as string;
  const { data: nData, isLoading: nLoading } = useNodesProjectIdQuery(pid);

  if (nLoading) return <div>Loading...</div>;

  return (
    <TreeDndProvider allNodes={nData?.nodes || []}>
      {/* We call the inner component here so it can use useDroppable */}
      <NavMainInner nodes={nData?.nodes || []} />
    </TreeDndProvider>
  );
}

function NavMainInner({ nodes }: { nodes: INode[] }) {
  const params = useParams();
  const pid = params.pid as string;
  const { data: nData, isLoading: nLoading } = useNodesProjectIdQuery(pid);
  const { isCreating } = useNodeStore();
  // Register the entire sidebar area as a Droppable
  const { setNodeRef, isOver, active } = useDroppable({
    id: 'root',
  });

  // Only show background if we are dragging a node AND we are hovering over the root
  // OR if we are dragging and NOT hovering over any specific item (falling back to root)
  const isDraggingSomething = !!active;
  const showRootHighlight =
    isDraggingSomething &&
    isOver &&
    active &&
    active.data.current &&
    active.data.current.parentId !== null;
  // 1. Flatten all IDs across all levels
  const allNodeIds = React.useMemo(() => flattenNodeIds(nData?.nodes || []), [nData?.nodes]);

  if (nLoading) return <div>Loading...</div>;

  const { folders, files } = groupNodes(nData?.nodes || []);
  const isCreatingAtRoot = isCreating && isCreating.parentId === null;

  return (
    // 2. Pass the full node tree to the Provider for logic lookups

    <div
      ref={setNodeRef}
      className={cn(
        'h-full!',
        showRootHighlight
          ? 'bg-accent/30 ring-2 ring-inset ring-accent-foreground/10'
          : 'bg-transparent'
      )}
    >
      <SortableContext items={allNodeIds} strategy={verticalListSortingStrategy}>
        <SidebarGroup className="p-0! h-auto">
          {isCreatingAtRoot && isCreating.type === 'folder' && (
            <SidebarCreateFolderItem depth={0} />
          )}
          {folders.map(item => (
            <SidebarItem key={item._id} item={item} depth={0} />
          ))}

          {isCreatingAtRoot && isCreating.type === 'file' && <SidebarCreateFileItem depth={0} />}
          {files.map(item => (
            <SidebarItem key={item._id} item={item} depth={0} />
          ))}
        </SidebarGroup>
      </SortableContext>
    </div>
  );
}
