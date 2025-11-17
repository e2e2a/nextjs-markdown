import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTrashMutations } from '@/hooks/trash/useTrashMutations';
import { makeToastError } from '@/lib/toast';
import { ArchivedItem } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import { useCallback } from 'react';

const Dropdown = ({ item }: { item: ArchivedItem }) => {
  const mutation = useTrashMutations();
  const retrieve = useCallback(() => {
    mutation.retrieve.mutate(item, {
      onSuccess: () => {
        return;
      },
      onError: err => {
        makeToastError(err.message);
        return;
      },
    });
  }, [item, mutation]);

  const handleDelete = useCallback(() => {
    mutation.deletePermanently.mutate([item], {
      onSuccess: () => {
        return;
      },
      onError: err => {
        makeToastError(err.message);
        return;
      },
    });
  }, [item, mutation]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => retrieve()} className="cursor-pointer">
          Retrieve
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDelete()}
          className="focus:bg-red-300 cursor-pointer"
        >
          Delete Permanently
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
