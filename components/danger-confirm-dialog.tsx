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
import { useNodeMutations } from '@/hooks/node/useNodeMutations';
import { makeToastError } from '@/lib/toast';
import { INode } from '@/types';
import { useCallback, useState } from 'react';
interface IProps {
  triggerTitle: string;
  title: string;
  description: string;
  node: INode;
}
export function DangerConfirmDialog({ triggerTitle, title, description, node }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useNodeMutations();
  const updateTitle = useCallback(
    (node: INode) => {
      const payload = {
        userId: '665b09bf080766539a81e938',
        _id: node?._id as string,
        type: node?.type,
        // title: node.title,
        // content: null,
        archived: {
          isArchived: true,
          archivedAt: new Date(),
          archivedBy: '665b09bf080766539a81e938',
        },
      };
      console.log('running');
      mutation.update.mutate(payload, {
        onSuccess: res => {
          console.log('res', res);
          return;
        },
        onError: err => {
          console.log('err', err);
          makeToastError(err.message);
          return;
        },
      });
    },
    [mutation]
  );
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        className="w-full py-1.5 flex items-center pl-8"
        onClick={() => setIsOpen(true)}
        asChild
      >
        <span>{triggerTitle}</span>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={e => e.preventDefault()} onContextMenu={e => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue-500 hover:bg-blue-500/90"
            onClick={() => {
              setIsOpen(false);
              setTimeout(() => updateTitle(node), 0);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
