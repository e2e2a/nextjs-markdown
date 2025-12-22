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
import { IUserWorkspaces } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { makeToastError } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { useWorkspaceMemberMutations } from '@/hooks/workspasceMember/useMutation';

interface IProps {
  item: IUserWorkspaces;
}

export function Leave({ item }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled] = useState(item.role === 'owner' && item.ownerCount === 1);

  const mutation = useWorkspaceMemberMutations();

  const leaveWorkspace = useCallback(() => {
    setLoading(true);
    mutation.leave.mutate(item.workspaceId._id as string, {
      onSuccess: () => {
        setIsOpen(false);
        return;
      },
      onError: err => {
        makeToastError(err.message);
        return;
      },
      onSettled: () => {
        setLoading(false);
        return;
      },
    });
  }, [item, mutation]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="w-full text-center">
        <AlertDialogTrigger
          className={'w-auto'}
          disabled={disabled || loading}
          onClick={() => setIsOpen(true)}
          asChild
        >
          {disabled ? (
            <Tooltip>
              <TooltipTrigger asChild className="cursor-not-allowed h-auto w-auto">
                <span tabIndex={0} className="h-auto w-auto">
                  <Button
                    size={'sm'}
                    variant={'outline'}
                    type="button"
                    disabled={true}
                    className="bg-accent hover:text-none"
                  >
                    LEAVE
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px]" side="left">
                You can&apos;t leave a workspace when you are the only workspace owner.
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="text-center">
              <Button
                size={'sm'}
                type="button"
                variant={'outline'}
                disabled={loading}
                className="action-button hover:text-none"
              >
                LEAVE
              </Button>
            </div>
          )}
        </AlertDialogTrigger>
      </div>

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
            By leaving{' '}
            <span className="font-bold text-accent-foreground">{item.workspaceId.title}</span>
            , you will lose access to all projects in that workspace.
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
            className="bg-destructive text-destructive-foreground cursor-pointer"
            disabled={disabled || loading}
            onClick={leaveWorkspace}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
