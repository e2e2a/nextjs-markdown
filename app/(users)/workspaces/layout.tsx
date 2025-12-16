import { SidebarWrapper } from '@/components/sidebar-wrapper';
import { WorkspaceMemberProvider } from '@/context/WorkspaceMember';
import { sidebarData } from '@/data/sidebar/workspace';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WorkspaceMemberProvider>
      <SidebarWrapper data={sidebarData} type={'workspaces'}>
        {children}
      </SidebarWrapper>
    </WorkspaceMemberProvider>
  );
}
