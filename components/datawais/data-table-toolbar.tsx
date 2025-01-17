'use client';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFilter } from './data-table-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className='flex items-center justify-end gap-2'>
      {isFiltered && (
        <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
          Reset
          <X />
        </Button>
      )}
      <DataTableFilter table={table} />
      <DataTableViewOptions table={table} />
    </div>
  );
}
