import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { InvitationTabs } from './components/invation-tabs';
import { Metadata } from 'next';
import { sidebarData } from '@/data/sidebar/users';

export const metadata: Metadata = {
  title: 'Project Invitations',
};

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar data={sidebarData} />
      <SidebarInset>
        <SiteHeader title={'Project Invitations'} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col p-0! m-0!">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="container mx-auto px-10">
                <h1 className="text-2xl md:text-3xl font-bold drop-shadow-sm ">
                  Project Invitations
                </h1>
                <div className="py-5">
                  <InvitationTabs />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
