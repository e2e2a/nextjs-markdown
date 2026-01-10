import { SidebarGroup } from '@/components/ui/sidebar';
import { INode } from '@/types';
import { useNodesProjectIdQuery } from '@/hooks/node/useNodeQuery';
import { useParams } from 'next/navigation';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { groupNodes } from '@/utils/node-utils';
import SidebarCreateFolderItem from '../project/nodes/sidebar-create-folder-item';
import SidebarItem from '../project/nodes/sidebar-item';
import SidebarCreateFileItem from '../project/nodes/sidebar-create-file-item';

export function NavMain() {
  const params = useParams();
  const pid = params.pid as string;
  const { data: nData, isLoading: nLoading, error: nError } = useNodesProjectIdQuery(pid);
  const { isCreating } = useNodeStore();

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     // if (isCreating) submit(file);
  //     // if (updateNode) updateTitle(file);
  //   }
  //   if (e.key === 'Escape') {
  //     setIsCreating(false);
  //     setFile({ name: '', oldName: '', type: '' });
  //   }
  // };

  if (nLoading) return <div>Loading...</div>;
  if (nError) return;
  const { folders, files } = groupNodes(nData?.nodes || []);
  const isCreatingAtRoot = isCreating && isCreating.parentId === null;
  return (
    <SidebarGroup className="p-0! h-auto">
      {/* If creating a folder, show it at the very top of the folder list */}
      {isCreatingAtRoot && isCreating.type === 'folder' && <SidebarCreateFolderItem depth={0} />}
      {folders.map((item: INode, index: number) => (
        <div key={index}>
          <SidebarItem item={item as INode} depth={0} />
        </div>
      ))}

      {/* If creating a file, show it at the very top of the file list (after all folders) */}
      {isCreatingAtRoot && isCreating.type === 'file' && <SidebarCreateFileItem depth={2} />}
      {files.map((item: INode, index: number) => (
        <div key={index}>
          <SidebarItem item={item as INode} depth={0} />
        </div>
      ))}
    </SidebarGroup>
  );
}
