import { IWorkspaceMember, TableMeta } from '@/types';
import TrashDialog from './trash-dialog';
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
    <div className="inline-grid grid-flow-col auto-cols-max gap-x-1.5 items-end justify-end">
      <div className="w-8.5">
        {item.status === 'accepted' && (
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
      </div>

      <div className="w-8.5">
        <TrashDialog item={item} workspaceId={workspaceId} />
      </div>
    </div>
  );
}
