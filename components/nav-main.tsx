'use client';
import { Separator } from '@/components/ui/separator';
import { SidebarGroup, SidebarGroupContent, SidebarMenu } from '@/components/ui/sidebar';
import { INavItem } from '@/types';
import { AppSidebarSection } from './app-sidebar-section';

interface NavMainProps {
  items: INavItem[];
}

export function NavMain({ items }: NavMainProps) {
  return (
    <SidebarGroup className="">
      <SidebarGroupContent className="flex flex-col gap-2 w-full">
        <SidebarMenu>
          {items.map((item, idx) => (
            <div className="" key={idx}>
              <AppSidebarSection item={item} />
              {idx + 1 !== items.length && <Separator className="" />}
            </div>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
