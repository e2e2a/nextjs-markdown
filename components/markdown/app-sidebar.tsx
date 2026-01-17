'use client';
import { NavMain } from './nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu } from '@/components/ui/sidebar';
import { CopyMinus, FilePlus2, FolderPlus } from 'lucide-react';
import { SidebarContextMenu } from './sidebar-context-menu';
import { useProjectByIdQuery } from '@/hooks/project/useProjectQuery';
import { useParams } from 'next/navigation';
import { Button } from '../ui/button';
import { useNodeStore } from '@/features/editor/stores/nodes';

export function AppSidebar() {
  const params = useParams();
  const pid = params.pid as string;
  const { data: pData, isLoading: pLoading } = useProjectByIdQuery(pid);
  const { setCollapseAll, selectedNode, setIsCreating } = useNodeStore();

  if (pLoading) return;
  let parentId: string | null = null;
  if (selectedNode)
    parentId = selectedNode.type === 'folder' ? selectedNode._id : selectedNode.parentId;
  return (
    <Sidebar
      className="group left-12 w-full border-r bg-none p-0 text-neutral-400"
      collapsible="none"
      variant="inset"
    >
      <SidebarContextMenu node={null}>
        <div data-sidebar-node="true" className="h-screen overflow-hidden flex flex-col">
          <SidebarHeader className="h-6 p-0">
            <SidebarMenu className="h-6 flex w-full flex-row items-center justify-center px-1 border-b border-border">
              <div className="font-bold truncate uppercase text-sm w-full text-accent-foreground ">
                {pData?.project.title}
              </div>
              <div className="hidden w-full bg-transparent flex-row items-center justify-end h-full gap-x-2 group-hover:flex">
                <Button
                  className="p-0! h-auto cursor-pointer bg-transparent text-inherit hover:text-accent-foreground hover:bg-transparent"
                  onClick={() => {
                    setIsCreating({ type: 'file', parentId });
                    setTimeout(() => {
                      const input = document.querySelector<HTMLInputElement>(
                        '#sidebar-creating-file-item input'
                      );
                      input?.focus();
                    }, 0);
                  }}
                >
                  <FilePlus2 className="h-4! w-4!" />
                </Button>
                <Button
                  className="p-0! h-auto cursor-pointer bg-transparent text-inherit hover:text-accent-foreground hover:bg-transparent"
                  onClick={() => {
                    setIsCreating({ type: 'folder', parentId });
                    setTimeout(() => {
                      const input = document.querySelector<HTMLInputElement>(
                        '#sidebar-creating-folder-item input'
                      );
                      input?.focus();
                    }, 0);
                  }}
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
                <Button
                  className="p-0! h-auto cursor-pointer bg-transparent text-inherit hover:text-accent-foreground hover:bg-transparent"
                  onClick={() => setCollapseAll(true)}
                >
                  <CopyMinus className="h-4 w-4" />
                </Button>
              </div>
            </SidebarMenu>
          </SidebarHeader>

          <div className="h-full flex-1 overflow-y-hidden">
            <SidebarContent className="ml-0 p-0! space-y-0! h-full">
              <NavMain />
            </SidebarContent>
          </div>
        </div>
      </SidebarContextMenu>
    </Sidebar>
  );
}
