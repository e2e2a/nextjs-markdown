import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Eye, LogOut, MailCheck, MailX } from 'lucide-react';
import { MembersInvited } from '@/types';
import { useCallback } from 'react';
import { useMemberMutations } from '@/hooks/member/useMemberMutations';
import { makeToastError } from '@/lib/toast';
import Tooltips from '@/components/tooltips';
import Link from 'next/link';

const ButtonGroupAction = ({ item }: { item: MembersInvited }) => {
  const mutation = useMemberMutations();

  const updateStatus = useCallback(
    (status: 'pending' | 'accepted' | 'rejected' | 'leave') => {
      mutation.updateStatus.mutate(
        { id: item._id as string, status: status },
        {
          onSuccess: () => {
            return;
          },
          onError: err => {
            makeToastError(err.message);
            return;
          },
        }
      );
    },
    [item, mutation]
  );

  return (
    <ButtonGroup>
      {item.status === 'pending' && (
        <ButtonGroup>
          <Tooltips description={'Accept Project'}>
            <Button
              onClick={() => updateStatus('accepted')}
              variant="outline"
              className="cursor-pointer"
            >
              <MailCheck />
            </Button>
          </Tooltips>
          <Tooltips description={'Reject Project'}>
            <Button
              onClick={() => updateStatus('rejected')}
              variant="outline"
              className="text-red-500 cursor-pointer"
            >
              <MailX />
            </Button>
          </Tooltips>
        </ButtonGroup>
      )}
      {item.status === 'accepted' && (
        <ButtonGroup>
          <Tooltips description={'View Project'}>
            <Link href={`/project/${item.projectId._id}`}>
              <Button variant="outline" className="cursor-pointer">
                <Eye />
              </Button>
            </Link>
          </Tooltips>
          <Tooltips description={'Leave Project'}>
            <Button
              onClick={() => updateStatus('leave')}
              variant="outline"
              className="text-red-500 cursor-pointer"
            >
              <LogOut />
            </Button>
          </Tooltips>
        </ButtonGroup>
      )}
    </ButtonGroup>
  );
};

export default ButtonGroupAction;
