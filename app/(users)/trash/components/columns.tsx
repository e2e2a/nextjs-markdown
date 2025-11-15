'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import Dropdown from './dropdown';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { ArchivedItem } from '@/types';
import { dateFormatted } from '@/hooks/use-date-format';

export const columns: ColumnDef<ArchivedItem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: 'archived.archivedBy.email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Trash By
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: 'size',
    id: 'size',
    header: 'Size',
    cell: ({ row }) => {
      const value = row.getValue('size');
      return (
        <div>
          {value as string} <span className="font-medium">Bytes</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'path',
    id: 'path',
    header: 'Path',
  },
  {
    accessorKey: 'archived.archivedAt',
    id: 'archivedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Trash Date
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateString = row.getValue('archivedAt');
      const date = new Date(dateString as Date);
      const formatted = dateFormatted(date);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      return <Dropdown item={item} />;
    },
  },
];
