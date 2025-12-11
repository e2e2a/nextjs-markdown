import { SidebarWrapper } from '@/components/sidebar-wrapper';
import { sidebarData } from '@/data/sidebar/preferences/workspace';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarWrapper data={sidebarData} type="preferences">
      {children}
    </SidebarWrapper>
  );
}
