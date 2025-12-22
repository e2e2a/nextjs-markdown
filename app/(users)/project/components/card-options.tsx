'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IProject } from '@/types';
import { Ellipsis, FolderPen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { MembersDialog } from './members-dialog';

interface IProps {
  project: IProject;
  setUpdate: React.Dispatch<
    React.SetStateAction<{ _id: string; oldTitle: string; isUpdating: boolean }>
  >;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  handleUpdate: (data: {
    _id: string;
    oldTitle?: string;
    title?: string;
    archived?: { isArchived: boolean; archivedAt: Date };
  }) => void;
}

export function CardOptions({ project, setUpdate, setValue, handleUpdate }: IProps) {
  const [open, setOpen] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className="cursor-pointer hover:bg-transparent focus-visible:ring-0 outline-0"
        asChild
      >
        <Button variant="ghost" className=" focus-visible:ring-0 outline-0">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" onClick={handleClick}>
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuGroup>
          <MembersDialog project={project} />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <div
            className="cursor-pointer flex justify-between p-2 text-sm focus:bg-neutral-100 hover:bg-neutral-100 rounded-md"
            onClick={() => {
              setOpen(false);
              setUpdate({ _id: project._id, oldTitle: project.title, isUpdating: true });
              setValue(project.title);
            }}
          >
            <div className="">Rename</div>
            <FolderPen className="h-4 w-4 text-muted-foreground" />
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={e => {
              handleClick(e);
              setOpen(false);
              handleUpdate({
                _id: project._id,
                archived: {
                  isArchived: true,
                  archivedAt: new Date(),
                },
              });
            }}
          >
            Trash
            <DropdownMenuShortcut>
              <Trash2 />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
