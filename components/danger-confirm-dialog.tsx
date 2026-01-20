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
import { useState } from 'react';
import { ContextMenuItem } from './ui/context-menu';
interface IProps {
  triggerTitle: string;
  title: string;
  description: string;
  node: INode;
}
export function DangerConfirmDialog({ triggerTitle, title, description, node }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useNodeMutations();
  // const updateArchived = useCallback(
  //   (node: INode) => {
  //     const payload = {
  //       _id: node?._id as string,
  //       type: node?.type,
  //       archived: {
  //         isArchived: true,
  //         archivedAt: new Date(),
  //       },
  //     };

  //     mutation.update.mutate(payload, {
  //       onSuccess: () => {
  //         return;
  //       },
  //       onError: err => {
  //         makeToastError(err.message);
  //         return;
  //       },
  //     });
  //   },
  //   [mutation]
  // );

  const onTrash = async () => {
    mutation.trash.mutate(
      { _id: node._id as string, pid: node.projectId },
      {
        onSuccess: () => {
          setIsOpen(false);
          return;
        },
        onError: err => {
          makeToastError(err.message);
          return;
        },
        onSettled: () => {
          setIsOpen(false);
        },
      }
    );
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        className="w-full py-1.5 flex items-center pl-8 cursor-pointer"
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
              onTrash();
            }}
            asChild
          >
            <ContextMenuItem className=" cursor-pointer ">Continue</ContextMenuItem>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
