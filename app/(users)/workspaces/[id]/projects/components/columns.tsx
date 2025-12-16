'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { IProject } from '@/types';
import Link from 'next/link';
import { Actions } from './actions';
import { dateFormatted } from '@/hooks/use-date-format';

export const columns: ColumnDef<IProject>[] = [
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
    id: 'Project Name',
    size: 10,
    minSize: 10,
    maxSize: 40,
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0! hover:bg-transparent!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Project Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original;
      const value = row.getValue('Project Name');
      return (
        <Link href={`/project/${project._id}`} className="text-blue-500 hover:underline">
          {value as string}
        </Link>
      );
    },
  },
  {
    id: 'Users',
    accessorKey: 'memberCount',
    enableHiding: true,
    header: 'Users',
    // cell: () => {
    //   return <span className="capitalize">Free</span>;
    // },
    cell: ({ row }) => {
      const project = row.original;
      const value = row.getValue('Users');
      return (
        <Link
          href={`/workspace/${project.workspaceId}/access/users`}
          className="text-blue-500 hover:underline"
        >
          {value as string}
        </Link>
      );
    },
  },
  {
    id: 'Role',
    accessorKey: 'role',
    enableHiding: true,
    header: 'Role',
    cell: ({ row }) => {
      const value = row.getValue('Role');
      return <span className="uppercase font-semibold">{(value as string) || 'owner'}</span>;
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0! hover:bg-transparent!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          createdAt
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateString = row.getValue('createdAt');
      const date = new Date(dateString as Date);
      const formatted = dateFormatted(date);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: true,
    cell: ({ row }) => {
      const item = row.original;

      return <Actions item={item} />;
    },
  },
];
