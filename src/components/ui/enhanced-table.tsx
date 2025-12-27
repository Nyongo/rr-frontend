
import React from "react";
import { Table } from "./table";
import { EnhancedTableHeader, Column } from "./table-header";
import { EnhancedTableBody } from "./table-body";
import { TablePagination } from "./table-pagination";
import { useTableSorting } from "./use-table-sorting";
import { useTablePagination } from "./use-table-pagination";

interface EnhancedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onRowClick?: (row: T) => void;
  pagination?: {
    enabled?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
  };
}

export function EnhancedTable<T extends Record<string, any>>({ 
  data, 
  columns, 
  className,
  onRowClick,
  pagination = { enabled: true, pageSize: 10, pageSizeOptions: [5, 10, 20, 50], showPageSizeSelector: true }
}: EnhancedTableProps<T>) {
  const { sortedData, sortConfig, handleSort } = useTableSorting(data);
  
  const {
    currentPage,
    totalPages,
    pageSize,
    pageSizeOptions,
    showPageSizeSelector,
    paginatedData,
    handlePageChange,
    handlePageSizeChange
  } = useTablePagination(sortedData, pagination);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="overflow-x-auto -mx-2 sm:mx-0">
      <Table className={className}>
        <EnhancedTableHeader
          columns={columns}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
        <EnhancedTableBody
          data={paginatedData}
          columns={columns}
          onRowClick={onRowClick}
        />
      </Table>
      </div>

      {pagination?.enabled && totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          showPageSizeSelector={showPageSizeSelector}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}

export type { Column };
