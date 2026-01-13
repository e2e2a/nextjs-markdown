'use client';
import React, { useEffect, useRef, memo, useState } from 'react';
import { useParams } from 'next/navigation';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { AppContent } from './app-content';
import { AppShell } from './app-shell';
import { AppSidebar } from './app-sidebar';
import RightSidebarTemplate from './right-sidebar';
import MiniSidebarTemplate from './mini-left-sidebar';
import { Button } from '../ui/button';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { TreeDndProvider } from '@/features/editor/components/tree-dnd-provider';
import { useNodesProjectIdQuery } from '@/hooks/node/useNodeQuery';

const MainContentArea = memo(function MainContentArea({ children }: { children: React.ReactNode }) {
  return (
    <AppContent variant="sidebar" className="text-muted-foreground">
      <div className="flex-1">
        <header className="flex h-6 p-0 items-center border-b">
          <div className="flex flex-row h-full items-center overflow-x-auto overflow-y-hidden">
            <Button className="bg-transparent rounded-none border border-border border-b-background z-10 h-full text-xs px-3">
              File 1
            </Button>
          </div>
        </header>
        {children}
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
  const { data: nData } = useNodesProjectIdQuery(pid);
  const { activeNode, selectedNode, setIsUpdatingNode, setSelectedNode } = useNodeStore();

  const LeftSidebarRef = useRef<ImperativePanelHandle>(null);
  const RightSidebarRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'F2' && selectedNode) {
        setIsUpdatingNode(selectedNode);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedNode, setIsUpdatingNode]);

  // const handlePanelMouseDown = (e: React.MouseEvent) => {
  //   const target = e.target as HTMLElement;
  //   if (target.closest('[data-sidebar-node]')) return;
  //   if (e.button !== 2) {
  //     setSelectedNode(activeNode ? activeNode : null);
  //   }
  // };

  return (
    <AppShell variant="sidebar">
      <TreeDndProvider allNodes={nData?.nodes || []}>
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="sidebar-layout"
          className="overflow-y-hidden rounded-none bg-white"
          onMouseDownCapture={e => {
            const target = e.target as HTMLElement;
            if (target.closest('[data-sidebar-node]')) return;
            if (e.button !== 2) {
              setSelectedNode(activeNode ? activeNode : null);
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
            <AppSidebar />
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
      </TreeDndProvider>
    </AppShell>
  );
}
