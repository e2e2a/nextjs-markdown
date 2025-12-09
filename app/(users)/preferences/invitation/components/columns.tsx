'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { IUserInvitations } from '@/types';
import { Actions } from './actions';
import { dateFormatted } from '@/hooks/use-date-format';

export const columns: ColumnDef<IUserInvitations>[] = [
  {
    id: 'select',
    size: 10,
    minSize: 10,
    maxSize: 10,
    enableHiding: true,
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
  },
  {
    id: 'Workspace Name',
    size: 250,
    minSize: 250,
    maxSize: 250,
    accessorKey: 'workspaceId.title',
    header: 'Details',
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="whitespace-normal break-all">
          <span className="font-semibold">{item.invitedBy?.email} </span>
          invited you to organization{' '}
          <span className="font-semibold">{item.workspaceId?.title}</span>
        </div>
      );
    },
  },
  {
    id: 'Sent',
    accessorKey: 'createdAt',
    enableHiding: true,
    header: 'Sent',
    cell: ({ row }) => {
      const dateString = row.getValue('Sent');
      const date = new Date(dateString as Date);
      const formatted = dateFormatted(date);

      return <div className="">{formatted}</div>;
    },
  },
  {
    id: 'Role',
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const value = row.getValue('Role');
      return <span className="capitalize">{value as string}</span>;
    },
  },
  {
    id: 'actions',
    size: 200,
    minSize: 200,
    maxSize: 200,
    enableHiding: true,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="w-full max-w-20">
          <Actions item={item} />
        </div>
      );
    },
  },
];
