import { IWorkspaceMember, TableMeta } from '@/types';
import RemoveDialog from './remove-dialog';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table } from '@tanstack/react-table';
import { useParams } from 'next/navigation';

interface IProps {
  item: IWorkspaceMember;
  table: Table<IWorkspaceMember>;
}

export function Actions({ item, table }: IProps) {
  const meta = table.options.meta as TableMeta;
  const { setEditingMemberId } = meta;
  const params = useParams();
  const workspaceId = params.id as string;
  return (
    <div className="inline-flex flex-row gap-x-1.5 items-center justify-center">
      {item.user && (
        <Button
          size={'sm'}
          variant={'outline'}
          className="action-button items-center border-0 flex w-8.5!"
          onClick={() => {
            setEditingMemberId(item._id);
          }}
        >
          <Pencil />
        </Button>
      )}

      <RemoveDialog item={item} workspaceId={workspaceId} />
    </div>
  );
}
