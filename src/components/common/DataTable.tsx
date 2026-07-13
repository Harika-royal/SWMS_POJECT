import { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from './EmptyState';

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({ 
  columns, 
  data, 
  keyExtractor, 
  onRowClick,
  emptyTitle = "No data available",
  emptyDescription = "There are no records to display at this time."
}: DataTableProps<T>) {
  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            {columns.map((col, index) => (
              <TableHead
  key={index}
  className={`font-semibold text-slate-700 uppercase tracking-wide text-xs ${col.className ?? ""}`}
>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow 
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={`transition-all duration-200 hover:bg-slate-50 hover:shadow-sm ${
  onRowClick ? "cursor-pointer" : ""
}`}
            >
              {columns.map((col, index) => (
                <TableCell
  key={index}
  className={`py-4 ${col.className ?? ""}`}
>
                  {col.cell ? col.cell(item) : col.accessorKey ? item[col.accessorKey] as ReactNode : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
