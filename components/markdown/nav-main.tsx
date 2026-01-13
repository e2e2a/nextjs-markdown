// 'use client';
// import { SidebarGroup } from '@/components/ui/sidebar';
// import { useNodesProjectIdQuery } from '@/hooks/node/useNodeQuery';
// import { useParams } from 'next/navigation';
// import { useNodeStore } from '@/features/editor/stores/nodes';
// import { groupNodes } from '@/utils/node-utils';
// import SidebarCreateFolderItem from '../project/nodes/sidebar-create-folder-item';
// import SidebarItem from '../project/nodes/sidebar-item';
// import SidebarCreateFileItem from '../project/nodes/sidebar-create-file-item';
// import { useDndContext } from '@dnd-kit/core';

// // 2. Update NavMainInner to be "Static"
// export function NavMain() {
//   const params = useParams();
//   const pid = params.pid as string;
//   const { data: nData, isLoading: nLoading } = useNodesProjectIdQuery(pid);
//   const { isCreating } = useNodeStore();
//   const { active } = useDndContext();
//   console.log('active123', active);

//   if (nLoading) return <div>Loading...</div>;
//   const { folders, files } = groupNodes(nData?.nodes || []);
//   const isCreatingAtRoot = isCreating && isCreating.parentId === null;
//   return (
//     <div className="h-full">
//       <SidebarGroup className="p-0! h-auto">
//         {isCreatingAtRoot && isCreating.type === 'folder' && <SidebarCreateFolderItem depth={0} />}
//         {folders.map(item => (
//           <SidebarItem active={active} key={item._id} item={item} depth={0} />
//         ))}

//         {isCreatingAtRoot && isCreating.type === 'file' && <SidebarCreateFileItem depth={0} />}
//         {files.map(item => (
//           <SidebarItem active={active} key={item._id} item={item} depth={0} />
//         ))}
//       </SidebarGroup>
//     </div>
//   );
// }

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
      <NavMainInner nodes={nData?.nodes || []} />
    </TreeDndProvider>
  );
}

function NavMainInner({ nodes }: { nodes: INode[] }) {
  const { isCreating } = useNodeStore();
  const { folders, files } = React.useMemo(() => groupNodes(nodes), [nodes]);

  // Static tree content never sees drag state
  const treeContent = React.useMemo(
    () => (
      <>
        {isCreating && isCreating.parentId === null && isCreating.type === 'folder' && (
          <SidebarCreateFolderItem depth={0} />
        )}
        {folders.map(item => (
          <SidebarItem active={null} key={item._id} item={item} depth={0} />
        ))}
        {isCreating && isCreating.parentId === null && isCreating.type === 'file' && (
          <SidebarCreateFileItem depth={0} />
        )}
        {files.map(item => (
          <SidebarItem active={null} key={item._id} item={item} depth={0} />
        ))}
      </>
    ),
    [folders, files, isCreating]
  );

  return <RootDroppableWrapper>{treeContent}</RootDroppableWrapper>;
}

// Small wrapper only for drag-over highlight
function RootDroppableWrapper({ children }: { children: React.ReactNode }) {
  // const { setNodeRef } = useDroppable({ id: 'root' });
  console.log('asd');
  // const highlightClass = React.useMemo(() => {
  //   if (!active) return 'bg-transparent';
  //   // return 'bg-accent/30 ring-2 ring-inset ring-accent-foreground/10';
  //   return 'bg-transparent';
  // }, [active]);

  return <div>{children}</div>;
}
