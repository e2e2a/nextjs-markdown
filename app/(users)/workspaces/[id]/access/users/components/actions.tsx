import { IWorkspaceMember, TableMeta } from '@/types';
import RemoveDialog from './remove-dialog';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table } from '@tanstack/react-table';

interface IProps {
  item: IWorkspaceMember;
  table: Table<IWorkspaceMember>;
}

export function Actions({ item, table }: IProps) {
  const meta = table.options.meta as TableMeta;
  const { setEditingMemberId } = meta;
  return (
    <div className="inline-flex flex-row gap-x-1 items-center justify-center ">
      <Button
        variant="outline"
        size={'sm'}
        className="bg-secondary items-center border border-primary/20 flex w-8.5! whitespace-nowrap shrink-0 text-sm text-primary font-normal rounded-xl hover:text-none cursor-pointer"
        onClick={() => {
          setEditingMemberId(item._id);
        }}
      >
        <Pencil />
      </Button>
      <RemoveDialog item={item} />
    </div>
  );
}
