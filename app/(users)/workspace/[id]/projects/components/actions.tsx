import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useCallback, useState } from 'react';
import { IProject } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { makeToastError, makeToastSucess } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { useInvitationMutations } from '@/hooks/invitation/useMutation';

interface IProps {
  item: IProject;
}

export function Actions({ item }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const mutation = useInvitationMutations();

  const handleDecline = useCallback(() => {
    setLoading(true);
    mutation.accept.mutate(item.workspaceId._id as string, {
      onSuccess: () => {
        makeToastSucess('Invitation accepted successfully.');
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
    });
  }, [item, mutation]);

  const handleAccept = useCallback(() => {
    setLoading(true);
    mutation.decline.mutate(item.workspaceId._id as string, {
      onSuccess: () => {
        makeToastSucess('Invitation declined successfully.');
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
    });
  }, [item, mutation]);

  return (
    <div className="inline-flex flex-row gap-x-2 items-center justify-center ">
      <div className="text-center">
        <Button
          size={'sm'}
          type="button"
          variant={'ghost'}
          onClick={handleAccept}
          className="hover:text-none  bg-secondary font-medium border border-primary/20 rounded-xl cursor-pointer"
        >
          ACCEPT
        </Button>
      </div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <AlertDialogTrigger
            className={'w-auto'}
            disabled={loading}
            onClick={() => setIsOpen(true)}
          >
            <TooltipTrigger asChild className="cursor-not-allowed h-auto w-auto">
              <span tabIndex={0} className="h-auto w-auto">
                <div className="bg-red-500 w-full items-center flex size-4 px-3 gap-1.5 whitespace-nowrap shrink-0 text-sm h-8 text-secondary font-medium hover:bg-red-600 rounded-xl hover:text-none cursor-pointer">
                  DECLINE
                </div>
              </span>
            </TooltipTrigger>
          </AlertDialogTrigger>
          <TooltipContent className="max-w-[200px]" side="left">
            You are about to decline the invitation. You will not be able to join this workspace
            unless you are invited again.
          </TooltipContent>
        </Tooltip>

        <AlertDialogContent
          className="top-[5%] translate-y-0"
          onClick={e => e.preventDefault()}
          onContextMenu={e => e.preventDefault()}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-start">
              Leave Workspace
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to decline the invitation to{' '}
              <span className="font-bold">{item.workspaceId.title}</span>
              . You will not be able to join this workspace unless you are invited again.
              <br />
              <br />
              <span>Are you sure you want to proceed?</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button" className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-500/90 cursor-pointer"
              disabled={loading}
              onClick={() => handleDecline()}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
