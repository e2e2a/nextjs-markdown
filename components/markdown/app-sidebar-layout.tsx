import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { INode, type BreadcrumbItem } from '@/types';
import { useRef, type PropsWithChildren } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { AppContent } from './app-content';
import { AppShell } from './app-shell';
import { AppSidebarHeader } from './app-sidebar-header';
import RightSidebarTemplate from './right-sidebar';
import MiniSidebarTemplate from './mini-left-sidebar';
import { AppSidebar } from './app-sidebar';
import { IProject } from '@/modules/projects/project.model';

export default function AppSidebarLayout({
  children,
  project,
  nodes = [],
  breadcrumbs = [],
  active,
  setActive,
}: PropsWithChildren<{
  project: IProject;
  nodes?: INode[];
  breadcrumbs?: BreadcrumbItem[];
  active: Partial<INode> | null;
  setActive: React.Dispatch<React.SetStateAction<Partial<INode> | null>>;
}>) {
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

  return (
    <AppShell variant="sidebar">
      <ResizablePanelGroup
        direction="horizontal"
        autoSaveId="sidebar-layout"
        className="overflow-y-hidden rounded-none bg-white"
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
          <AppSidebar active={active} setActive={setActive} project={project} nodes={nodes} />
        </ResizablePanel>

        <ResizableHandle className="p-0" />

        <ResizablePanel className="flex-1 h-full max-h-full p-0" minSize={8} defaultSize={60}>
          <AppContent variant="sidebar" className="text-muted-foreground ">
            <div className="flex-1">
              <AppSidebarHeader breadcrumbs={breadcrumbs} />
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
