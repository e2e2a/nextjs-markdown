'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SectionCards } from '@/app/(users)/project/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useProjectsByUserIdQuery } from '@/hooks/project/useProjectQuery';

export default function Page() {
  const {
    data: projects,
    isLoading: loading,
    error,
  } = useProjectsByUserIdQuery('665b09bf080766539a81e938');
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">dashboard</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
