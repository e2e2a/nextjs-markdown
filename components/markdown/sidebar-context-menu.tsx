import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { DocumentTree } from '@/types';
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  item: DocumentTree;
}

export function SidebarContextMenuDemo({ children, item }: ContainerProps) {
  console.log('item', item.type);
  return (
    <ContextMenu>
      <ContextMenuTrigger className="text-black" asChild>
        <div className="">{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem inset>
          New File
          {/* <ContextMenuShortcut>⌘[</ContextMenuShortcut> */}
        </ContextMenuItem>
        {/* <ContextMenuItem inset disabled> */}
        <ContextMenuItem inset>New Folder</ContextMenuItem>
        <ContextMenuSeparator />
        {/* <ContextMenuCheckboxItem checked>Show Bookmarks</ContextMenuCheckboxItem> */}
        <ContextMenuItem inset>Cut</ContextMenuItem>
        <ContextMenuItem inset>Copy</ContextMenuItem>
        <ContextMenuItem inset>Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>Rename</ContextMenuItem>
        <ContextMenuItem inset>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
