'use client';
import { Separator } from '@/components/ui/separator';
import { SidebarGroup, SidebarGroupContent, SidebarMenu } from '@/components/ui/sidebar';
import { INavItem } from '@/types';
import { AppSidebarSection } from './app-sidebar-section';

interface NavMainProps {
  items: INavItem[];
  initialLink: string;
}

export function NavMain({ items, initialLink }: NavMainProps) {
  return (
    <SidebarGroup className="">
      <SidebarGroupContent className="flex flex-col gap-2 w-full">
        <SidebarMenu>
          {items.map((item, idx) => (
            <div className="" key={idx}>
              <AppSidebarSection initialLink={initialLink} item={item} />
              {idx + 1 !== items.length && <Separator className="" />}
            </div>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
