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
import { IProject } from '@/types';
import { useProjectMutations } from '@/hooks/project/useProjectMutations';
import { makeToastError, makeToastSucess } from '@/lib/toast';
import { useState } from 'react';
import { useGetUserWorkspaces } from '@/hooks/workspace/useQuery';
import { useSession } from 'next-auth/react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, X } from 'lucide-react';

interface IProps {
  item: IProject;
}

export function MoveProjectAction({ item }: IProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');

  const { data: session } = useSession();
  const { data: wData, isLoading: wLoading } = useGetUserWorkspaces(session?.user?._id as string);
  const mutation = useProjectMutations();

  const onSubmit = async () => {
    setLoading(true);
    if (item.workspaceId === selectedWorkspace)
      return makeToastError('Project is already in the target workspace');

    mutation.move.mutate(
      { wid: selectedWorkspace, currentwid: item.workspaceId, pid: item._id },
      {
        onSuccess: () => {
          setOpen(false);
          makeToastSucess('Project has been sucessfuly moved.');
          return;
        },
        onError: err => {
          makeToastError(err.message);
          return;
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  if (wLoading) return;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start px-2 font-normal cursor-pointer">
          Move Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] top-[5%] translate-y-0 rounded-md">
        <div className="overflow-hidden">
          <DialogHeader>
            <DialogTitle>Move Project</DialogTitle>
            <DialogDescription>
              You are about to move this project to another workspace.
            </DialogDescription>
          </DialogHeader>
          <Command className="h-auto gap-2 overflow-y-auto">
            <CommandInput placeholder="SEARCH PROJECT TO MOVE..." className="h-9 " />
            <CommandList>
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup className="border">
                <RadioGroup value={selectedWorkspace}>
                  {wData &&
                    wData.workspaces.length > 0 &&
                    wData.workspaces.map(w => (
                      <CommandItem
                        key={w._id}
                        value={w.title}
                        onSelect={() => {
                          if (w._id === item.workspaceId) return;
                          setSelectedWorkspace(w._id);
                        }}
                        className={cn(
                          w.membership.role !== 'owner' || w._id === item.workspaceId
                            ? 'cursor-not-allowed opacity-50 bg-accent'
                            : '',
                          selectedWorkspace === w._id ? 'bg-accent' : '',
                          'uppercase border-b border-t'
                        )}
                      >
                        <RadioGroupItem value={w._id} id={w._id} />
                        <div className="flex flex-col">
                          <span className="">{w.title}</span>
                          <span className="">
                            {w.projectCount} projects - {w.ownerCount} owners
                          </span>
                          <div
                            className={cn(
                              'flex items-center gap-x-1',
                              w.membership.role !== 'owner' || w._id === item.workspaceId
                                ? 'text-red-500'
                                : 'text-green-500'
                            )}
                          >
                            <div
                              className={cn(
                                'h-5 w-5 p-1  rounded-md flex items-center justify-center',
                                w.membership.role !== 'owner' || w._id === item.workspaceId
                                  ? 'bg-red-500'
                                  : 'bg-green-500'
                              )}
                            >
                              {w.membership.role !== 'owner' || w._id === item.workspaceId ? (
                                <X className="h-4 w-4 stroke-foreground stroke-5" />
                              ) : (
                                <Check className="h-4 w-4 stroke-foreground stroke-5" />
                              )}
                            </div>
                            {w.membership.role !== 'owner' && (
                              <span className="font-bold">You are not an owner.</span>
                            )}
                            {w.membership.role === 'owner' && w._id === item.workspaceId && (
                              <span className="font-bold">
                                You cannot migrate to the same workspace.
                              </span>
                            )}
                            {w.membership.role === 'owner' && w._id !== item.workspaceId && (
                              <span className="font-bold">Eligble to move.</span>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                </RadioGroup>
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="cursor-pointer"
              onClick={onSubmit}
              disabled={!selectedWorkspace || loading}
            >
              Move Project
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
