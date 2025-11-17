'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { MembersInvited } from '@/types';
import { dateFormatted } from '@/hooks/use-date-format';
import ButtonGroupAction from './button-group-action';

export const columns: ColumnDef<MembersInvited>[] = [
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
    accessorKey: 'projectId.title',
    id: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Project Title
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: 'invitedBy.email',
    id: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          InvitedBy
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          InvitedAt
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateString = row.getValue('createdAt');
      const date = new Date(dateString as Date);
      const formatted = dateFormatted(date);

      return <div className="">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      return <ButtonGroupAction item={item} />;
    },
  },
];
