'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SectionCards } from '@/app/(users)/project/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { LayoutButtons } from './components/layout-buttons';
import { CreateFolderButton } from './components/create-folder-button';
import { useProjectsByUserIdQuery } from '@/hooks/project/useProjectQuery';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Page() {
  const [isCreating, setIsCreating] = useState(false);
  const { data: session, status } = useSession();

  const {
    data: projects,
    isLoading: loading,
    // error,
  } = useProjectsByUserIdQuery(session?.user?._id as string);

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
      <AppSidebar
      // variant="inset" // if want having padding in box
      />
      <SidebarInset>
        <SiteHeader />
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
