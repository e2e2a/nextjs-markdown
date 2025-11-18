import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, UserMinus, UserX } from 'lucide-react';
import { MembersInvited } from '@/types';
import { useCallback } from 'react';
import { useMemberMutations } from '@/hooks/member/useMemberMutations';
import { makeToastError } from '@/lib/toast';
import Tooltips from '@/components/tooltips';

const Action = ({ item }: { item: MembersInvited }) => {
  const mutation = useMemberMutations();

  const deleteMember = useCallback(() => {
    mutation.deleteMember.mutate(
      { id: item._id as string },
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
  }, [item, mutation]);

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
    <div>
      {item.status === 'pending' && (
        <Tooltips description={'Cancel Invitation'}>
          <Button
            onClick={() => deleteMember()}
            variant="outline"
            className="text-red-500 cursor-pointer"
          >
            <UserX />
          </Button>
        </Tooltips>
      )}

      {item.status === 'accepted' && (
        <Tooltips description={'Remove Member'}>
          <Button
            onClick={() => deleteMember()}
            variant="outline"
            className="text-red-500 cursor-pointer"
          >
            <UserMinus />
          </Button>
        </Tooltips>
      )}

      {(item.status === 'leave' || item.status === 'rejected') && (
        <Tooltips description={'Reinvite member'}>
          <Button
            variant="outline"
            onClick={() => updateStatus('pending')}
            className="text-blue-500 hover:text-blue-500 cursor-pointer"
          >
            <RotateCw />
          </Button>
        </Tooltips>
      )}
    </div>
  );
};

export default Action;
