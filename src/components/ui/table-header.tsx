
import React from "react";
import { TableHead, TableHeader, TableRow } from "./table";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface EnhancedTableHeaderProps<T> {
  columns: Column<T>[];
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  } | null;
  onSort: (columnKey: string) => void;
}

export function EnhancedTableHeader<T>({ 
  columns, 
  sortConfig, 
  onSort 
}: EnhancedTableHeaderProps<T>) {
  const getSortDirection = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) return null;
    return sortConfig.direction;
  };

  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead
            key={column.key as string}
            sortable={column.sortable}
            sortDirection={getSortDirection(column.key as string)}
            onSort={() => column.sortable && onSort(column.key as string)}
            className={column.className}
          >
            {column.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
