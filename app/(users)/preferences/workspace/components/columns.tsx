'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { IUserWorkspaces } from '@/types';
import { Leave } from './leave';
import Link from 'next/link';

export const columns: ColumnDef<IUserWorkspaces>[] = [
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
    size: 10,
    minSize: 10,
    maxSize: 40,
    accessorKey: 'workspaceId.title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Workspace Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const workspace = row.original.workspaceId;
      const value = row.getValue('Workspace Name');
      return (
        <Link
          href={`/workspace/${workspace._id}/projects`}
          className="text-blue-500 hover:underline"
        >
          {value as string}
        </Link>
      );
    },
  },
  {
    id: 'Plan Type',
    // accessorKey: 'plan.type',
    enableHiding: true,
    header: 'Plan Type',
    cell: () => {
      return <span className="capitalize">Free</span>;
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
    enableHiding: true,
    cell: ({ row }) => {
      const item = row.original;

      return <Leave item={item} />;
    },
  },
];
