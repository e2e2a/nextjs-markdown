import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { DocumentTree } from '@/types';
import SidebarItem from './sidebar-item';

export function NavMain({ items = [] }: { items: DocumentTree[] }) {
  return (
    <SidebarGroup className="gap-0 p-0">
      <SidebarMenu className="gap-0">
        {items.map((item, index) => {
          return (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild tooltip={{ children: item.title }}>
                <SidebarItem item={item as DocumentTree} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
