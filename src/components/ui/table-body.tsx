
import React from "react";
import { TableBody, TableCell, TableRow } from "./table";
import { cn } from "@/lib/utils";
import { Column } from "./table-header";

interface EnhancedTableBodyProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

export function EnhancedTableBody<T extends Record<string, any>>({ 
  data, 
  columns, 
  onRowClick 
}: EnhancedTableBodyProps<T>) {
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((value, key) => value?.[key], obj);
  };

  return (
    <TableBody>
      {data.map((row, index) => {
        const isInactive = row.status && row.status.toLowerCase() === 'inactive';
        return (
          <TableRow 
            key={index}
            className={cn(
              isInactive && "opacity-60 bg-gray-50/50",
              onRowClick && "cursor-pointer hover:bg-blue-50/70"
            )}
            onClick={() => onRowClick && onRowClick(row)}
          >
            {columns.map((column) => (
              <TableCell 
                key={column.key as string} 
                className={cn(
                  column.className,
                  isInactive && "text-gray-500"
                )}
              >
                {column.render 
                  ? column.render(getNestedValue(row, column.key as string), row)
                  : getNestedValue(row, column.key as string)
                }
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
