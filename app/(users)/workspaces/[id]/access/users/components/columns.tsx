'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { IWorkspaceMember } from '@/types';
import { dateFormatted } from '@/hooks/use-date-format';
import { Badge } from '@/components/ui/badge';
import { Actions } from './actions';
import { RoleDropdown } from './role-dropdown';

export const columns: ColumnDef<IWorkspaceMember>[] = [
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
    id: 'Display Name',
    size: 10,
    minSize: 10,
    maxSize: 40,
    accessorFn: row => (row.user ? `${row.user.given_name} ${row.user.family_name}` : ''),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Display Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const member = row.original;
      return (
        <>
          {member.user ? (
            <span>
              {member.user.given_name as string} {member.user.family_name as string}
            </span>
          ) : (
            <Badge>Pending Invite</Badge>
          )}
        </>
      );
    },
  },
  {
    id: 'Email',
    size: 10,
    minSize: 10,
    maxSize: 40,
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0! hover:bg-transparent!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    id: 'Role',
    accessorKey: 'role',
    enableHiding: true,
    header: 'Role',
    cell: ({ row, table }) => {
      const item = row.original;

      return <RoleDropdown item={item} table={table} />;
    },
  },
  {
    id: 'Projects',
    accessorKey: 'projects',
    enableHiding: true,
    header: 'Projects',
  },
  {
    accessorKey: 'user.last_login',
    id: 'Last Login',
    enableHiding: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Last Login Date
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateString = row.getValue('Last Login');
      const date = new Date(dateString as Date);
      const formatted = dateFormatted(date);

      return <div className="font-medium">{dateString ? formatted : 'Has not logged in yet'}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'invitedAt',
    enableHiding: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          invitedAt
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateString = row.getValue('invitedAt');
      const date = new Date(dateString as Date);
      const formatted = dateFormatted(date);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: true,
    cell: ({ row, table }) => {
      const item = row.original;

      return <Actions item={item} table={table} />;
    },
  },
];
