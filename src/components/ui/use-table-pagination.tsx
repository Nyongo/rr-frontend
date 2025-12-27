
import { useState } from "react";

interface PaginationConfig {
  enabled?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
}

export function useTablePagination<T>(
  data: T[], 
  config: PaginationConfig = {}
) {
  const { 
    enabled = true, 
    pageSize: initialPageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    showPageSizeSelector = true
  } = config;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Pagination calculations
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = enabled ? data.slice(startIndex, endIndex) : data;

  // Reset to first page when page size changes
  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    pageSize,
    pageSizeOptions,
    showPageSizeSelector,
    paginatedData,
    handlePageChange,
    handlePageSizeChange
  };
}
