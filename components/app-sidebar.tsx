'use client';
import * as React from 'react';
import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { INavItem } from '@/types';
import { PanelLeftIcon } from 'lucide-react';

type IProps = React.ComponentProps<typeof Sidebar> & {
  data: INavItem[];
  collapsible: 'offcanvas' | 'icon' | 'none';
  initialLink: string;
};

export function AppSidebar({ data, collapsible, initialLink, ...props }: IProps) {
  const { setOpen, open } = useSidebar();
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Sidebar
      collapsible={collapsible}
      {...props}
      onMouseEnter={() => {
        setExpanded(open);
        setOpen(true);
      }}
      onMouseLeave={() => {
        if (!expanded) setOpen(false);
      }}
      className="sticky! h-full! duration-100!"
    >
      <SidebarContent>
        <NavMain initialLink={initialLink} items={data} />
      </SidebarContent>
      <SidebarFooter className="sm:flex hidden">
        <SidebarMenuItem className="data-[slot=sidebar-menu-button]:p-0.5!">
          <SidebarMenuButton asChild className="w-auto" onClick={() => setExpanded(!expanded)}>
            <PanelLeftIcon />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
