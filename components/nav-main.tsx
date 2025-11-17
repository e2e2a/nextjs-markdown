'use client';
import { Separator } from '@/components/ui/separator';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { NavItem } from '@/types';

interface NavMainProps {
  items: {
    section1: NavItem[];
    section2: NavItem[];
    section3: NavItem[];
  };
}

export function NavMain({ items }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Create Project"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Create Project</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu> */}
        <SidebarMenu>
          {items.section1.map((item, idx) => (
            <SidebarMenuItem key={idx}>
              <SidebarMenuButton tooltip={item.title}>
                <Link
                  href={item.url}
                  className="inline-flex w-full text-black z-100 gap-2 items-center"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <Separator className="" />
        <SidebarMenu>
          {items.section2.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <Link
                  href={item.url}
                  className="inline-flex w-full text-black z-100 gap-2 items-center"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <Separator className="" />
        <SidebarMenu>
          {items.section3.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <Link
                  href={item.url}
                  className="inline-flex w-full text-black z-100 gap-2 items-center"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
