'use client';

import * as React from 'react';
import {
  IconDatabase,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Handshake, MessageCircleMore, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: {
    section1: [
      {
        title: 'My Projects',
        url: '/project',
        icon: IconFolder,
      },
    ],
    section2: [
      {
        title: 'Comments',
        url: '#',
        icon: MessageCircleMore,
      },
      {
        title: 'My Trash',
        url: '/trash',
        icon: Trash2,
      },
    ],
    section3: [
      {
        title: 'Project Invitations',
        url: '/invite',
        icon: Handshake,
      },
      {
        title: 'Team',
        url: '/team',
        icon: IconUsers,
      },
    ],
  },
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: IconDatabase,
    },
    {
      name: 'Reports',
      url: '#',
      icon: IconReport,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/">
                <Image
                  alt="Project Logo"
                  src={'/images/logo.png'}
                  width={50}
                  height={50}
                  priority
                  className="size-7.5! rounded-sm"
                />
                <span className="text-base font-semibold">MondreyMD</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
