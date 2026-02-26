'use client';
import AppSidebarLayout from '@/components/markdown/app-sidebar-layout';
import { useParams } from 'next/navigation';
import { MarkdownSection } from './MarkdownSection'; // Import the finished section
import { INode } from '@/types';
import { useTabStore } from '@/features/editor/stores/tabs';

export function ProjectSingleClient() {
  const params = useParams();
  const pid = params.pid as string;
  const { projectTabs, activeTabs } = useTabStore();
  const tabs = projectTabs[pid] || [];
  const activeTabId = activeTabs[pid];

  return (
    <AppSidebarLayout>
      <div className="h-full">
        {tabs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 select-none">
            <div className="border-2 border-dashed border-muted rounded-xl p-8 flex flex-col items-center">
              <p className="text-sm font-medium">No file selected</p>
              <p className="text-xs">Open a file to start editing</p>
            </div>
          </div>
        )}

        {tabs.map(tab => {
          return (
            <div key={tab.nodeId} className={tab.nodeId === activeTabId ? 'h-full w-full block' : 'hidden'}>
              <div className="absolute top-13 left-0 right-0 h-14 z-50 flex items-center px-10 border-b border-white/5 bg-sidebar/20 backdrop-blur-xs pointer-events-auto cursor-default drop-shadow-xs shadow-xs">
                <h1 className="text-5xl font-bold tracking-tighter text-foreground truncate select-text w-fit! cursor-text">
                  {(tab.node as INode)?.title || 'Not Found'}
                </h1>
              </div>
              <MarkdownSection node={tab.node as INode} isDirty={tab.isDirty} />
            </div>
          );
        })}
      </div>
    </AppSidebarLayout>
  );
}
