'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { DocumentTree } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';

interface IProps {
  item: DocumentTree;
}

export default function SidebarItem({ item }: IProps) {
  const localStorageKey = `sidebar-open-${item.id}`;
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Wait until client-side before reading localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(localStorageKey);
      if (stored === 'true') {
        setIsOpen(true);
      }
    } catch {
      // ignore read errors
    }
  }, [localStorageKey]);

  // Persist the open/close state
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(localStorageKey, String(isOpen));
    } catch {
      // ignore write errors
    }
  }, [mounted, localStorageKey, isOpen]);

  // ⛔ Don’t render dynamic open/close UI until mounted
  if (!mounted) {
    return (
      <SidebarMenuButton asChild className="m-0 h-4.5 gap-0 rounded-none opacity-50">
        <p className="truncate">{item.title}</p>
      </SidebarMenuButton>
    );
  }

  // ✅ Stable client-side render starts here
  if (!item.children?.length) {
    return (
      <SidebarMenuButton asChild className="m-0 h-4.5 gap-0 rounded-none">
        <Link href={`/dashboard/${item.slug}`} prefetch>
          <p className="truncate">{item.title}</p>
        </Link>
      </SidebarMenuButton>
    );
  }

  return (
    <Collapsible
      key={item.title}
      title={item.title}
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group gap-0"
    >
      <SidebarGroup className="p-0">
        <SidebarGroupLabel
          asChild
          className="group/label hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-none text-sm"
        >
          <CollapsibleTrigger className="h-auto gap-0">
            <ChevronRight className={`transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
            <p className="truncate">{item.title}</p>
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent className="gap-0">
          <SidebarGroupContent className="gap-0">
            <SidebarMenu className="gap-0">
              {item.children.map((child, i) => (
                <SidebarMenuItem className="pl-5" key={i}>
                  <SidebarItem item={child} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
