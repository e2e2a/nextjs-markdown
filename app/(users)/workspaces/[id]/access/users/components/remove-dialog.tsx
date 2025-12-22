import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { IWorkspaceMember } from '@/types';
import { Trash, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { makeToastError, makeToastSucess } from '@/lib/toast';
import { useProjectMutations } from '@/hooks/project/useProjectMutations';
import { useState } from 'react';
import { useGetMyWorkspaceMembership } from '@/hooks/workspasceMember/useQueries';

interface IProps {
  item: IWorkspaceMember;
  workspaceId: string;
}

export default function RemoveDialog({ item, workspaceId }: IProps) {
  const { data: membership } = useGetMyWorkspaceMembership(workspaceId);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [canRemove] = useState(membership.role !== 'viewer');

  const mutation = useProjectMutations();

  const onSubmit = async () => {
    setLoading(true);
    mutation.handleDelete.mutate(
      { pid: item._id },
      {
        onSuccess: () => {
          makeToastSucess('Project Name has been updated.');
          setIsOpen(false);
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
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <AlertDialogTrigger
          className={'w-auto'}
          disabled={!canRemove}
          onClick={() => setIsOpen(true)}
        >
          <TooltipTrigger asChild className="h-auto w-auto">
            <span tabIndex={0} className="h-auto w-auto">
              <div
                className={`${
                  !canRemove && 'opacity-50 cursor-not-allowed'
                } action-button w-full items-center flex size-4 px-2 gap-1.5 h-8`}
              >
                <Trash className="h-4 w-4" />
              </div>
            </span>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <TooltipContent className="max-w-[200px]" side="top">
          You are about to delete the project. All the data inside of the project will be lost.
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent className="flex sm:flex-row gap-x-1 flex-col rounded-md">
        <div className="place-items-center sm:place-items-start">
          <div className="bg-red-200 rounded-full p-1 flex items-center justify-center h-8 w-8">
            <TriangleAlert className="text-red-600 h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-col">
          <AlertDialogHeader className="gap-y-3">
            <AlertDialogTitle className="sm:text-xl text-start font-bold">
              Are you sure you want to delete this project?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-start">
              This action cannot be undone. This will permanently delete the project{' '}
              <span className="font-bold">{item.user.email}</span>, including all associated tasks,
              files, and data. All team members will immediately lose access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <span className="my-3">Are you sure you wish to proceed?</span>
          <AlertDialogFooter className="mt-5">
            <AlertDialogCancel type="button" className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <Button
              className="bg-red-500 hover:bg-red-500/90 cursor-pointer"
              disabled={loading}
              type="submit"
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
