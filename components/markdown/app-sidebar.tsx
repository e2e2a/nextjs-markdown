'use client';
import { NavMain } from './nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu } from '@/components/ui/sidebar';
import { CopyMinus, FilePlus2, FolderPlus } from 'lucide-react';
import { SidebarContextMenu } from './sidebar-context-menu';
import { useProjectByIdQuery } from '@/hooks/project/useProjectQuery';
import { useParams } from 'next/navigation';
import { Button } from '../ui/button';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { useEffect } from 'react';
import { makeToastError } from '@/lib/toast';
import { useNodeMutations } from '@/hooks/node/useNodeMutations';

export function AppSidebar() {
  const params = useParams();
  const pid = params.pid as string;
  const { data: pData, isLoading: pLoading } = useProjectByIdQuery(pid);
  const { setCollapseAll, selectedNode, activeNode, setIsCreating, undo, clearHistory } = useNodeStore();
  const mutation = useNodeMutations();
  useEffect(() => {
    if (!pid) return;

    clearHistory();
  }, [pid, clearHistory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const isUndo = (isMac && e.metaKey && e.key === 'z') || (!isMac && e.ctrlKey && e.key === 'z');

      if (!isUndo) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;
      console.log(document.activeElement);
      const sidebarRoot = document.querySelector('[data-sidebar-node="true"]');
      // if (!sidebarRoot || !sidebarRoot.contains(target)) return;
      const active = document.activeElement as HTMLElement | null;
      if (!active || !sidebarRoot || !sidebarRoot.contains(active)) return;
      // ignore inputs
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

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
              mutation.move.mutate({ _id: op.draggedId, pid, parentId: op.fromParentId });
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
  }, [undo, pid, mutation]);

  if (pLoading) return;
  let parentId: string | null = null;
  if (activeNode) parentId = activeNode.type === 'folder' ? activeNode._id : activeNode.parentId;
  if (selectedNode) parentId = selectedNode.type === 'folder' ? selectedNode._id : selectedNode.parentId;

  return (
    <Sidebar
      id="sidebar-tree-nodes"
      data-sidebar-node="true"
      tabIndex={-1}
      className="group left-12 w-full border-r bg-none p-0 text-neutral-400"
      collapsible="none"
      variant="inset"
    >
      <SidebarContextMenu node={null}>
        <div className="h-screen overflow-hidden flex flex-col">
          <SidebarHeader className="h-6 p-0">
            <SidebarMenu className="h-6 flex w-full flex-row items-center justify-center px-1 border-b border-border">
              <div className="font-bold truncate uppercase text-sm w-full text-accent-foreground ">{pData?.project.title}</div>
              <div className="hidden w-full bg-transparent flex-row items-center justify-end h-full gap-x-2 group-hover:flex">
                <Button
                  className="p-0! h-auto cursor-pointer bg-transparent text-inherit hover:text-accent-foreground hover:bg-transparent"
                  onClick={() => {
                    setIsCreating({ type: 'file', parentId });
                    setTimeout(() => {
                      const input = document.querySelector<HTMLInputElement>('#sidebar-creating-file-item input');
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
                      const input = document.querySelector<HTMLInputElement>('#sidebar-creating-folder-item input');
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
