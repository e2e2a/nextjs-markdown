import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
import { UsersRound } from 'lucide-react';
import { DialogTabs } from './dialog-tabs';
import { IProject } from '@/types';

interface IProps {
  project: IProject;
}

export function MembersDialog({ project }: IProps) {
  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="font-normal w-full p-2! py-1.5! cursor-pointer focus:bg-neutral-100 hover:bg-neutral-100"
      >
        <Button variant="ghost" className="py-1.5! focus:bg-neutral-100 hover:bg-neutral-100">
          Member
          <DropdownMenuShortcut>
            <UsersRound />
          </DropdownMenuShortcut>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md top-4 translate-y-0 max-h-[90vh] h-auto flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Members</DialogTitle>
          <DialogDescription>
            Invite new members and manage all existing ones here.
          </DialogDescription>
        </DialogHeader>
        <DialogTabs project={project} />
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
