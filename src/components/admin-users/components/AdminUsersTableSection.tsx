import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EnhancedTable } from "@/components/ui/enhanced-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { Search } from "lucide-react";
import { AdminUser, Pagination } from "../types";
import { createAdminUserColumns } from "../table-configs/adminUserColumns";

interface AdminUsersTableSectionProps {
  users: AdminUser[];
  pagination: Pagination;
  searchTerm: string;
  onEditUser: (user: AdminUser) => void;
  onResetPassword: (user: AdminUser) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearch: (search: string) => void;
}

export const AdminUsersTableSection = ({
  users,
  pagination,
  searchTerm,
  onEditUser,
  onResetPassword,
  onPageChange,
  onPageSizeChange,
  onSearch,
}: AdminUsersTableSectionProps) => {
  // No client-side filtering needed - server handles search

  const userColumns = createAdminUserColumns(onEditUser, onResetPassword);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search users by name, email or phone..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <EnhancedTable
        data={users}
        columns={userColumns}
        pagination={{ enabled: false }}
      />

      {/* Server-side Pagination */}
      {pagination.totalPages > 1 && (
        <TablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          showPageSizeSelector={true}
          onPageChange={onPageChange}
          onPageSizeChange={(pageSize) => onPageSizeChange(parseInt(pageSize))}
        />
      )}
    </div>
  );
};
