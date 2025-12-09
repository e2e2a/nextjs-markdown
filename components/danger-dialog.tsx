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
import { useState } from 'react';

interface IProps {
  triggerTitle: string;
  title: string;
  description: string;
}
export function DangerDialog({ triggerTitle, title, description }: IProps) {
  const [isOpen, setIsOpen] = useState(false);

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
              // setTimeout(() => updateArchived(node), 0);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
