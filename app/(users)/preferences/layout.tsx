// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SidebarWrapper } from '@/components/sidebar-wrapper';
import { sidebarData } from '@/data/sidebar/preferences/workspace';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getServerSession(authOptions);

  return <SidebarWrapper data={sidebarData}>{children}</SidebarWrapper>;
}
