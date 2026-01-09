import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { INode } from '@/types';
import { useEffect, useRef, type PropsWithChildren } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { AppContent } from './app-content';
import { AppShell } from './app-shell';
import RightSidebarTemplate from './right-sidebar';
import MiniSidebarTemplate from './mini-left-sidebar';
import { AppSidebar } from './app-sidebar';
import { Button } from '../ui/button';
import { useNodeStore } from '@/features/editor/stores/nodes';

export default function AppSidebarLayout({
  children,
  active,
  setActive,
}: PropsWithChildren<{
  active: INode | null;
  setActive: React.Dispatch<React.SetStateAction<INode | null>>;
}>) {
  const { activeNode, setIsCreating, setIsUpdatingNode, setSelectedNode } = useNodeStore();
  const LeftSidebarRef = useRef<ImperativePanelHandle>(null);
  const handleResizeLeftSidebar = (size: number) => {
    if (size <= 4 && LeftSidebarRef.current) {
      LeftSidebarRef.current.collapse();
    }
  };

  const RightidebarRef = useRef<ImperativePanelHandle>(null);
  const handleResizeRightSidebar = (size: number) => {
    if (size <= 1 && RightidebarRef.current) {
      RightidebarRef.current.collapse();
    }
  };
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        if (!activeNode) return;
        setIsUpdatingNode(activeNode);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeNode, setIsUpdatingNode]);

  return (
    <AppShell variant="sidebar">
      <ResizablePanelGroup
        direction="horizontal"
        autoSaveId="sidebar-layout"
        className="overflow-y-hidden rounded-none bg-white"
        onMouseDownCapture={e => {
          if (e.button === 0 || e.button === 1 || e.button === 2) {
            const target = e.target as HTMLElement;

            if (target.closest('[node-editing="true"]')) return;
            console.log('running mouse down capture, resetting states');
            setIsCreating(false);
            setIsUpdatingNode(null);
            if (e.button !== 2) setSelectedNode(null);
          }
          return;
        }}
      >
        <MiniSidebarTemplate />

        <ResizablePanel
          ref={LeftSidebarRef}
          minSize={14}
          collapsedSize={0}
          defaultSize={20}
          onResize={handleResizeLeftSidebar}
          collapsible
          className="text-muted-foreground flex h-full flex-row p-0"
        >
          <AppSidebar active={active} setActive={setActive} />
        </ResizablePanel>

        <ResizableHandle className="p-0" />

        <ResizablePanel className="flex-1 h-full max-h-full p-0" minSize={8} defaultSize={60}>
          <AppContent variant="sidebar" className="text-muted-foreground">
            <div className="flex-1">
              <header className="flex h-6 p-0 items-center border-b">
                <div className="flex flex-row h-full items-center overflow-x-auto overflow-y-hidden">
                  <Button className="bg-transparent rounded-none border border-border border-b-background z-100 h-full">
                    File 1
                  </Button>
                </div>
              </header>
              {children}
            </div>
          </AppContent>
        </ResizablePanel>

        <ResizableHandle />
        <ResizablePanel
          className="flex-1 h-full max-h-full p-0"
          minSize={16}
          ref={RightidebarRef}
          defaultSize={20}
          collapsible
          onResize={handleResizeRightSidebar}
        >
          <AppContent variant="sidebar" className="text-muted-foreground ">
            <RightSidebarTemplate />
          </AppContent>
        </ResizablePanel>
      </ResizablePanelGroup>
    </AppShell>
  );
}
