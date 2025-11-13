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
import { EllipsisVertical, FolderPen, Trash2, UsersRound } from 'lucide-react';
import { useState } from 'react';

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
        <Button variant="ghost" className="p-0! focus-visible:ring-0 outline-0">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" onClick={handleClick}>
        <DropdownMenuLabel>Settings</DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" onClick={handleClick}>
            Members
            <DropdownMenuShortcut>
              <UsersRound />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={e => {
              handleClick(e);
              setOpen(false);
              setUpdate({ _id: project._id, oldTitle: project.title, isUpdating: true });
              setValue(project.title);
            }}
          >
            Rename
            <DropdownMenuShortcut>
              <FolderPen />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
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
