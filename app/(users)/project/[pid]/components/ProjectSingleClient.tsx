'use client';
import AppSidebarLayout from '@/components/markdown/app-sidebar-layout';
import { notFound, useParams } from 'next/navigation';
import { useProjectByIdQuery } from '@/hooks/project/useProjectQuery';
import { MarkdownSection } from './MarkdownSection'; // Import the finished section
import { useNodeStore } from '@/features/editor/stores/nodes';
import { useEffect, useState } from 'react';
import { INode } from '@/types';
import { useTabStore } from '@/features/editor/stores/tabs';

export function ProjectSingleClient() {
  const [activeFile, setActiveFile] = useState<INode | null>(null);
  const params = useParams();
  const pid = params.pid as string;
  const { data: pData, isLoading: pLoading, error: pError } = useProjectByIdQuery(pid);
  const { activeNode, selectedNode } = useNodeStore();
  const { projectTabs, activeTabs } = useTabStore();
  const tabs = projectTabs[pid] || [];
  const activeTabId = activeTabs[pid];

  useEffect(() => {
    if (activeNode && activeNode.type === 'file') {
      requestAnimationFrame(() => {
        setActiveFile(activeNode);
      });
    }
  }, [activeNode]);

  if (pLoading) return <div className="flex items-center justify-center h-screen bg-background text-muted-foreground">Loading workspace...</div>;
  if (pError) return notFound();
  return (
    <AppSidebarLayout>
      <div className="h-full">
        {/* {activeFile ? (
          <MarkdownSection key={activeFile._id} node={activeFile} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 select-none">
            <div className="border-2 border-dashed border-muted rounded-xl p-8 flex flex-col items-center">
              <p className="text-sm font-medium">No file selected</p>
              <p className="text-xs">Select a file from the sidebar to start editing</p>
            </div>
          </div>
        )} */}
        {tabs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 select-none">
            <div className="border-2 border-dashed border-muted rounded-xl p-8 flex flex-col items-center">
              <p className="text-sm font-medium">No file selected</p>
              <p className="text-xs">Open a file to start editing</p>
            </div>
          </div>
        )}

        {/* Keep-Alive: Map through ALL open tabs. 
          The component stays in DOM, preserving Yjs and CodeMirror state.
        */}
        {tabs.map(tab => {
          console.log('tab', tab);
          return (
            <div
              key={tab.nodeId}
              // Use visibility:hidden or display:none.
              // display:none is safer for layout, visibility preserves dimensions.
              className={tab.nodeId === activeTabId ? 'h-full w-full block' : 'hidden'}
            >
              {/* We pass the node data. 
               Note: You might need to fetch the full node object 
               if the tab only stores the ID/Title.
            */}
              <MarkdownSection node={tab.node as INode} />
            </div>
          );
        })}
      </div>
    </AppSidebarLayout>
  );
}
