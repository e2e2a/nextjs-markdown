import { useState } from 'react';
import { Input } from './ui/input';
import { Table } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';

type IProps<TData> = {
  table: Table<TData>;
};

export function FilterBy<TData>({ table }: IProps<TData>) {
  const firstColumnId = table.getHeaderGroups()?.[0]?.headers?.[1]?.id ?? '';
  const [value, setValue] = useState(firstColumnId);

  return (
    <div className="flex items-center">
      <Input
        placeholder={`Filter ${value}...`}
        value={(table.getColumn(value)?.getFilterValue() as string) ?? ''}
        onChange={event => table.getColumn(value)?.setFilterValue(event.target.value)}
        className="max-w-sm"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side={'bottom'}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="px-4 py-1 font-semibold">Filter By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {table.getHeaderGroups().map(headerGroup => (
              <div key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  if (header.column.columnDef.enableHiding) return;
                  return (
                    <DropdownMenuItem key={header.id} onClick={() => setValue(header.id)}>
                      {header.id}
                    </DropdownMenuItem>
                  );
                })}
              </div>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FilterBy;
