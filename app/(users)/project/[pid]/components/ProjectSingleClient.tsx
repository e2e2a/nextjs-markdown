'use client';
import AppSidebarLayout from '@/components/markdown/app-sidebar-layout';
import { notFound, useParams } from 'next/navigation';
import { useProjectByIdQuery } from '@/hooks/project/useProjectQuery';
import { MarkdownSection } from './MarkdownSection'; // Import the finished section
import { useNodeStore } from '@/features/editor/stores/nodes';

export function ProjectSingleClient() {
  const params = useParams();
  const pid = params.pid as string;
  const { data: pData, isLoading: pLoading, error: pError } = useProjectByIdQuery(pid);
  const { activeNode, selectedNode } = useNodeStore();

  if (pLoading) return <div className="flex items-center justify-center h-screen bg-background text-muted-foreground">Loading workspace...</div>;
  if (pError) return notFound();

  return (
    <AppSidebarLayout>
      <div className="h-full">
        {activeNode ? (
          <MarkdownSection
            key={activeNode._id} // Key ensures the editor resets when switching files
            node={activeNode}
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
