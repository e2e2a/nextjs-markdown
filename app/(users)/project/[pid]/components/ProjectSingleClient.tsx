'use client';
import AppSidebarLayout from '@/components/markdown/app-sidebar-layout';
import { notFound, useParams } from 'next/navigation';
import { useProjectByIdQuery } from '@/hooks/project/useProjectQuery';
import { useTabStore } from '@/features/editor/stores/tabs';
import { MarkdownSection } from './MarkdownSection'; // Import the finished section
import { INode } from '@/types';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { useEffect, useState } from 'react';

export function ProjectSingleClient() {
  const params = useParams();
  const pid = params.pid as string;
  const [active, setActive] = useState<INode | null>(null);
  // 1. Fetch Project and Nodes data
  const { data: pData, isLoading: pLoading, error: pError } = useProjectByIdQuery(pid);
  // const { data: nodes, isLoading: nLoading } = useNodesProjectIdQuery(pid);
  const { activeNode } = useNodeStore();
  // 2. Get the active tab ID from your store
  // const activeTabId = useTabStore(state => state.activeTabs[pid]);
  useEffect(() => {
    if (activeNode && activeNode.type === 'file') {
      requestAnimationFrame(() => {
        setActive(activeNode);
      });
    }
  }, [activeNode]);

  if (pLoading) return <div className="flex items-center justify-center h-screen bg-background text-muted-foreground">Loading workspace...</div>;
  if (pError) return notFound();

  return (
    <AppSidebarLayout>
      <div className="h-full bg-red-500">
        {active ? (
          <MarkdownSection
            key={active._id} // Key ensures the editor resets when switching files
            node={active}
          />
        ) : (
          /* Empty State: Shown when no tabs are open */
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 select-none">
            <div className="border-2 border-dashed border-muted rounded-xl p-8 flex flex-col items-center">
              <p className="text-sm font-medium">No file selected</p>
              <p className="text-xs">Select a file from the sidebar to start editing</p>
            </div>
          </div>
        )}
      </div>
    </AppSidebarLayout>
  );
}
