import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Blocks, Bot, Calendar, FileBox, Files, GitBranch, Terminal } from 'lucide-react';
import Link from 'next/link';

const MiniSidebarIconItems = [
  {
    title: 'Documentation',
    href: 'https://laravel.com/docs/starter-kits',
    icon: FileBox,
  },
  {
    title: 'Repository',
    href: 'https://github.com/laravel/react-starter-kit',
    icon: GitBranch,
  },
  {
    title: 'Repository',
    href: 'https://github.com/laravel/react-starter-kit',
    icon: Blocks,
  },
  {
    title: 'Repository',
    href: 'https://github.com/laravel/react-starter-kit',
    icon: Calendar,
  },
  {
    title: 'Repository',
    href: 'https://github.com/laravel/react-starter-kit',
    icon: Files,
  },
  {
    title: 'Repository',
    href: 'https://github.com/laravel/react-starter-kit',
    icon: Terminal,
  },
  {
    title: 'Bot',
    href: 'https://github.com/laravel/react-starter-kit',
    icon: Bot,
  },
];

const MiniSidebarTemplate = () => {
  return (
    <Sidebar className="w-12 border-r p-0 " collapsible="none" variant="floating">
      <div className="flex min-h-screen flex-col text-neutral-400 rounded-l-none ">
        <SidebarHeader className="hidden p-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild></SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="ml-0 p-0">
          <SidebarGroup className="gap-0 p-0">
            <SidebarMenu className="mt-3 gap-y-3">
              {MiniSidebarIconItems &&
                MiniSidebarIconItems.map((item, index) => {
                  /**
                   * note
                   * const { url, component } = usePage()
                   * className={url === '/users' ? 'active' : ''
                   * note if i set the active
                   * */
                  return (
                    <SidebarMenuItem className="" key={index}>
                      <Link
                        href={item.href || '#'}
                        className="flex w-full items-center justify-center hover:brightness-120 dark:hover:text-white"
                        prefetch
                      >
                        <item.icon className="h-6 w-6 stroke-[0.8px]" />
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-0">{/* <NavUser /> */}</SidebarFooter>
      </div>
    </Sidebar>
  );
};

export default MiniSidebarTemplate;
