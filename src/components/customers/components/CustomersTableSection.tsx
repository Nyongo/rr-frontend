import { Input } from "@/components/ui/input";
import { EnhancedTable } from "@/components/ui/enhanced-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { Search } from "lucide-react";
import { Customer } from "../types";
import { Pagination } from "@/services/customerApi";
import { createCustomerColumns } from "../table-configs/customerColumns";

interface CustomersTableSectionProps {
  customers: Customer[];
  pagination: Pagination;
  searchTerm: string;
  onEditCustomer: (customer: Customer) => void;
  onResetPassword: (customer: Customer) => void;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const CustomersTableSection = ({
  customers,
  pagination,
  searchTerm,
  onEditCustomer,
  onResetPassword,
  onSearch,
  onPageChange,
  onPageSizeChange,
}: CustomersTableSectionProps) => {
  const customerColumns = createCustomerColumns(
    onEditCustomer,
    onResetPassword
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search customers by name, contact person or email address..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Table */}
      <EnhancedTable
        data={customers}
        columns={customerColumns}
        pagination={{ enabled: false }}
      />

      {/* Server-side Pagination */}
      <TablePagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        pageSize={pagination.pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={(pageSize) => onPageSizeChange(parseInt(pageSize))}
      />
    </div>
  );
};
