import { useCallback, useState } from 'react';
import { IProject } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { makeToastError, makeToastSucess } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { useInvitationMutations } from '@/hooks/invitation/useMutation';
import TrashDialog from './trash-dialog';
import DropdownActions from './dropdown-action';

interface IProps {
  item: IProject;
}

export function Actions({ item }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const mutation = useInvitationMutations();

  const handleDecline = useCallback(() => {
    setLoading(true);
    mutation.accept.mutate(item._id as string, {
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
    mutation.decline.mutate(item._id as string, {
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
  console.log('item', item);
  return (
    <div className="inline-flex flex-row gap-x-1 items-center justify-center ">
      <DropdownActions isOpen={isOpen} setIsOpen={setIsOpen} loading={loading} item={item} />
      <TrashDialog isOpen={isOpen} setIsOpen={setIsOpen} loading={loading} item={item} />
    </div>
  );
}
