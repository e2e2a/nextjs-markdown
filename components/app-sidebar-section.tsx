'use client';
import React from 'react';
import { Triangle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './ui/sidebar';
import { INavItem } from '@/types';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { usePathname } from 'next/navigation';

interface IProps {
  item: INavItem;
  initialLink: string;
}

type IconComponentType = React.ComponentType<React.ComponentPropsWithoutRef<'svg'>>;
const iconMap: { [key: string]: IconComponentType } = LucideIcons as unknown as {
  [key: string]: IconComponentType;
};

export function AppSidebarSection({ item, initialLink }: IProps) {
  const IconComponent = iconMap[item?.icon];
  const pathname = usePathname();

  return (
    <Collapsible key={item.title} asChild defaultOpen={true} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title.toUpperCase()} className="uppercase font-bold">
            {IconComponent && <IconComponent />}
            <span>{item.title}</span>
            <Triangle className="ml-auto h-2 w-2! fill-primary transition-transform duration-200 rotate-180 group-data-[state=open]/collapsible:rotate-0" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem, idx) => (
              <SidebarMenuSubItem key={idx}>
                <SidebarMenuSubButton asChild isActive={pathname.endsWith(subItem.url)}>
                  <Link href={`${initialLink}${subItem.url}`}>
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
