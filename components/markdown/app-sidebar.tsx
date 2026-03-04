'use client';
import { NavMain } from './nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu } from '@/components/ui/sidebar';
import { FolderPlus, Bookmark, FolderOpen, Search, ChevronsDownUp, SquarePen, ArrowUpNarrowWide, GalleryVertical } from 'lucide-react';
import { SidebarContextMenu } from './sidebar-context-menu';
import { Button } from '../ui/button';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { useEffect } from 'react';
import { makeToastError } from '@/lib/toast';
import { useNodeMutations } from '@/hooks/node/useNodeMutations';
import { IProject } from '@/types';
import { SidebarFooterVault } from './sidebar-footer-vault';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTabStore } from '@/features/editor/stores/tabs';

export function AppSidebar({ projectData }: { projectData: IProject }) {
  const { setCollapseAll, setActiveNode, selectedNode, activeNode, setIsCreating, undo } = useNodeStore();
  const { activeTabs } = useTabStore();
  const activeTabId = activeTabs[projectData._id];
  const mutation = useNodeMutations();
  console.log('activeNode', activeNode);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const isUndo = (isMac && e.metaKey && e.key === 'z') || (!isMac && e.ctrlKey && e.key === 'z');

      if (!isUndo) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;
      const sidebarRoot = document.querySelector('[data-sidebar-node="true"]');
      // if (!sidebarRoot || !sidebarRoot.contains(target)) return;
      const active = document.activeElement as HTMLElement | null;
      if (!active || !sidebarRoot || !sidebarRoot.contains(active)) return;
      // ignore inputs
      // if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if (target.tagName === 'INPUT' || target.isContentEditable) return;

      e.preventDefault();

      // ✅ User intent undo
      // call API to move nodes back to previous state
      // syncNodesToServer(snapshot);

      try {
        const op = undo();
        if (op) {
          console.log('op', op);
          switch (op.type) {
            case 'create':
              mutation.trash.mutate({ _id: op.node._id as string, pid: op.node.projectId });
              break;
            case 'move':
              mutation.move.mutate({ _id: op.draggedId, pid: projectData?._id, parentId: op.fromParentId });
              break;
            case 'delete':
              mutation.restore.mutate([op.node]);
              break;
            case 'update':
              mutation.update.mutate({ _id: op.nodeId as string, pid: op.prev.projectId, title: op.prev.title });
              break;
          }
        }
      } catch (err) {
        let message = 'Unknown Error';
        if (err instanceof Error) {
          message = err.message;
        } else {
          message = err as string;
        }
        makeToastError(message);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, projectData?._id, mutation]);

  let parentId: string | null = null;
  if (activeNode) parentId = activeNode.type === 'folder' ? activeNode._id : activeNode.parentId;
  if (selectedNode) parentId = selectedNode.type === 'folder' ? selectedNode._id : selectedNode.parentId;

  return (
    <Sidebar
      id="sidebar-tree-nodes"
      data-sidebar-node="true"
      tabIndex={-1}
      className="group left-12 w-full border-r bg-none p-0 text-muted-foreground"
      collapsible="none"
      variant="inset"
    >
      <div className="h-screen flex flex-col">
        <SidebarContextMenu node={null}>
          <div className="h-full overflow-hidden flex flex-col">
            <Tabs defaultValue="nodes" className="w-full flex flex-col flex-1 min-h-0 gap-y-0">
              <SidebarHeader className="h-12 p-0">
                <SidebarMenu className="h-12 flex w-full flex-row items-center justify-center px-2 relative">
                  <TabsList className="bg-transparent w-full flex items-start gap-x-3 justify-start">
                    <TabsTrigger className="grow-0" value="nodes">
                      <FolderOpen className="w-6! h-6!" />
                    </TabsTrigger>
                    <TabsTrigger className="grow-0" value="search">
                      <Search className="w-6! h-6!" />
                    </TabsTrigger>
                    <TabsTrigger className="grow-0" value="bookmarks">
                      <Bookmark className="w-6! h-6!" />
                    </TabsTrigger>
                  </TabsList>

                  <div className="absolute top-12 left-0 right-0 h-1 z-51 w-full bg-background" />
                  <div className="absolute top-13 left-0 right-0 h-14 z-50 flex px-3 items-center border-b border-white/5 bg-sidebar/80 backdrop-blur-lg pointer-events-auto cursor-default">
                    <div className="flex w-full">
                      <TabsContent className="h-full min-h-0 w-full" value="nodes">
                        <div className="bg-transparent w-full flex items-start gap-x-1 justify-start">
                          <Button
                            className="px-2! py-1! border border-transparent"
                            variant={'ghost'}
                            title="New Note"
                            onClick={() => {
                              setIsCreating({ type: 'file', parentId });
                              setTimeout(() => {
                                const input = document.querySelector<HTMLInputElement>('#sidebar-creating-file-item input');
                                input?.focus();
                              }, 0);
                            }}
                          >
                            <SquarePen className="h-6! w-6!" />
                          </Button>
                          <Button
                            className="px-2! py-1! w-fit h-fit border border-transparent"
                            variant={'ghost'}
                            title="New Folder"
                            onClick={() => {
                              setIsCreating({ type: 'folder', parentId });
                              setTimeout(() => {
                                const input = document.querySelector<HTMLInputElement>('#sidebar-creating-folder-item input');
                                input?.focus();
                              }, 0);
                            }}
                          >
                            <FolderPlus className="h-6! w-6!" />
                          </Button>
                          <Button
                            className="px-2! py-1! border border-transparent"
                            variant={'ghost'}
                            title="New Note"
                            onClick={() => setCollapseAll(true)}
                          >
                            <ArrowUpNarrowWide className="h-6! w-6!" />
                          </Button>
                          <Button
                            className="px-2! py-1! border border-transparent"
                            variant={'ghost'}
                            title="Collapse All"
                            onClick={() => {
                              setActiveNode(null); // first clear
                              setTimeout(() => {
                                setActiveNode(activeTabId);
                              }, 0);
                            }}
                          >
                            <GalleryVertical className="h-6! w-6!" />
                          </Button>
                          <Button
                            className="px-2! py-1! border border-transparent"
                            variant={'ghost'}
                            title="Collapse All"
                            tabIndex={0}
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveNode(null);
                              setCollapseAll(true);
                            }}
                          >
                            <ChevronsDownUp className="h-6! w-6!" />
                          </Button>
                        </div>
                      </TabsContent>
                    </div>
                  </div>
                </SidebarMenu>
              </SidebarHeader>
              <div className="min-h-0 flex-1 overflow-hidden!">
                <SidebarContent className="ml-0 p-0! space-y-0! h-full flex">
                  <TabsContent className="h-full min-h-0 p-0! gap-0! space-x-0 space-y-0! m-0!" value="nodes">
                    <NavMain />
                  </TabsContent>
                  <TabsContent value="search" className="text-white pt-16">
                    Search
                  </TabsContent>
                  <TabsContent value="bookmarks" className="text-white pt-16">
                    Bookmarks
                  </TabsContent>
                </SidebarContent>
              </div>
            </Tabs>
          </div>
        </SidebarContextMenu>
        <SidebarFooter className="h-auto mt-1 bg-background/70 py-2">
          <SidebarFooterVault projectData={projectData} />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
