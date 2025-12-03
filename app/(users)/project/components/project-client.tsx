'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SectionCards } from '@/app/(users)/project/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useProjectsByUserIdQuery } from '@/hooks/project/useProjectQuery';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { LayoutButtons } from './layout-buttons';
import { CreateFolderButton } from './create-folder-button';
import { sidebarData } from '@/data/sidebar/users';

export function ProjectClient() {
  const [isCreating, setIsCreating] = useState(false);
  const { data: session, status } = useSession();

  const { data: projects, isLoading: loading } = useProjectsByUserIdQuery(
    session?.user?._id as string
  );

  if (status === 'loading') return;
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
        <SiteHeader title={'Projects'} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col p-0! m-0!">
            <div className="grid grid-cols-1 px-4 lg:px-6 pt-4">
              <div className="flex justify-end items-center w-full gap-x-4">
                <LayoutButtons />
                <div className="">Sort</div>
                <CreateFolderButton isCreating={isCreating} setIsCreating={setIsCreating} />
              </div>
            </div>
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards
                loading={loading}
                projects={projects}
                isCreating={isCreating}
                setIsCreating={setIsCreating}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
