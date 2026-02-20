'use client';
import React, { useEffect, useRef, memo } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { AppContent } from './app-content';
import { AppShell } from './app-shell';
import { AppSidebar } from './app-sidebar';
import RightSidebarTemplate from './right-sidebar';
import MiniSidebarTemplate from './mini-left-sidebar';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { notFound, useParams } from 'next/navigation';
import { TabsHeader } from '../project/tabs/tab-header';
import { useProjectByIdQuery } from '@/hooks/project/useProjectQuery';
import { useNodesProjectIdQuery } from '@/hooks/node/useNodeQuery';

const MainContentArea = memo(function MainContentArea({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pid = params.pid as string;

  return (
    <AppContent variant="sidebar" className="text-muted-foreground h-screen overflow-hidden">
      <div className="flex flex-col h-full w-full">
        <div className="h-10 bg-sidebar">
          <TabsHeader pid={pid} />
        </div>

        <div className="flex-1 min-h-0 w-full overflow-hidden">{children}</div>
      </div>
    </AppContent>
  );
});

const RightSidebarArea = memo(function RightSidebarArea() {
  return (
    <AppContent variant="sidebar" className="text-muted-foreground">
      <RightSidebarTemplate />
    </AppContent>
  );
});

export default function AppSidebarLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pid = params.pid as string;
  const { data: pData, isLoading: pLoading, error: pError } = useProjectByIdQuery(pid);
  const { data: nData, isLoading: nLoading } = useNodesProjectIdQuery(pid);
  const { activeNode, selectedNode, setIsUpdatingNode, setSelectedNode, clearHistory } = useNodeStore();
  const { setNodes } = useNodeStore();

  const LeftSidebarRef = useRef<ImperativePanelHandle>(null);
  const RightSidebarRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    if (!pid) return;

    clearHistory();
  }, [pid, clearHistory]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'F2' && (activeNode || selectedNode)) {
        setIsUpdatingNode(selectedNode || activeNode);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeNode, selectedNode, setIsUpdatingNode]);

  useEffect(() => {
    if (!nData && (!nData?.nodes || nData?.nodes?.length <= 0)) return;
    setNodes(nData?.nodes);
  }, [nData, setNodes]);

  // const handlePanelMouseDown = (e: React.MouseEvent) => {
  //   const target = e.target as HTMLElement;
  //   if (target.closest('[data-sidebar-node]')) return;
  //   if (e.button !== 2) {
  //     setSelectedNode(activeNode ? activeNode : null);
  //   }
  // };
  const isReady = !pLoading && !nLoading && pData?.project && nData?.nodes;
  if (!isReady) return <div className="flex items-center justify-center h-screen bg-background text-muted-foreground">Loading workspace...</div>;
  if (pError) return notFound();
  return (
    <AppShell variant="sidebar">
      <ResizablePanelGroup
        direction="horizontal"
        autoSaveId="sidebar-layout"
        className="overflow-y-hidden rounded-none bg-white"
        onMouseDownCapture={e => {
          const target = e.target as HTMLElement;
          if (target.closest('[data-sidebar-node]')) return;
          if (e.button !== 2) {
            setSelectedNode(null);
          }
        }}
      >
        <MiniSidebarTemplate />

        <ResizablePanel
          ref={LeftSidebarRef}
          minSize={14}
          collapsedSize={0}
          defaultSize={20}
          collapsible
          onResize={size => {
            if (size <= 4 && LeftSidebarRef.current) LeftSidebarRef.current.collapse();
          }}
          className="text-muted-foreground flex h-full flex-row p-0"
        >
          <AppSidebar projectData={pData?.project} />
        </ResizablePanel>

        <ResizableHandle className="p-0" />

        <ResizablePanel className="flex-1 h-full max-h-full p-0" minSize={8} defaultSize={60}>
          {/* These components are now frozen during DND updates */}
          <MainContentArea>{children}</MainContentArea>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel
          ref={RightSidebarRef}
          minSize={16}
          defaultSize={20}
          collapsible
          onResize={size => {
            if (size <= 1 && RightSidebarRef.current) RightSidebarRef.current.collapse();
          }}
          className="flex-1 h-full max-h-full p-0"
        >
          <RightSidebarArea />
        </ResizablePanel>
      </ResizablePanelGroup>
    </AppShell>
  );
}
