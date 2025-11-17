'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Trash } from 'lucide-react';
import { makeToastError } from '@/lib/toast';
import { useTrashMutations } from '@/hooks/trash/useTrashMutations';
import { ArchivedItem } from '@/types';
import PaginationDropdown from '@/components/paginationDropdown';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const mutation = useTrashMutations();

  const handleDelete = useCallback(
    (selectedRows: Row<TData>[]) => {
      const items = selectedRows.map(item => item.original);
      mutation.deletePermanently.mutate(items as ArchivedItem[], {
        onSuccess: () => {
          return;
        },
        onError: err => {
          makeToastError(err.message);
          return;
        },
      });
    },
    [mutation]
  );
  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between pt-4">
        <Input
          placeholder="Filter titles..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={event => table.getColumn('email')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <PaginationDropdown pagination={pagination} setPagination={setPagination} />
      </div>
      {selectedRows.length > 0 && (
        <div className="text-end">
          <Button
            variant={'outline'}
            onClick={() => handleDelete(selectedRows)}
            className="border border-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
          >
            <Trash />
            Delete Permanently
          </Button>
        </div>
      )}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => {
                    const cellValue = cell.getValue<string | number | undefined>();
                    return (
                      <TableCell
                        key={cell.id}
                        title={(cellValue as string) || ''}
                        className={cn(row.index === 5 ? 'max-w-2.5 truncate' : '')}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
