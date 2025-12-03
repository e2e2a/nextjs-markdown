'use client';
import * as React from 'react';
import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { INavItem } from '@/types';

type IProps = React.ComponentProps<typeof Sidebar> & {
  data: INavItem[];
};

export function AppSidebar({ data, ...props }: IProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-0.5!">
              <Link href="/">
                <Image
                  alt="Project Logo"
                  src={'/images/logo.png'}
                  width={50}
                  height={50}
                  priority
                  className="size-7! rounded-sm"
                />
                <span className="text-base font-semibold">MondreyMD</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data} />
      </SidebarContent>
    </Sidebar>
  );
}
