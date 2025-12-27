import { Button } from "@/components/ui/button";
import { Building, Plus, Import } from "lucide-react";

interface CustomersPageHeaderProps {
  onAddCustomer: () => void;
  onImportCustomers: () => void;
  totalCount?: number;
}

export const CustomersPageHeader = ({
  onAddCustomer,
  onImportCustomers,
  totalCount,
}: CustomersPageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Building className="w-8 h-8 text-green-600" />
          Customers
        </h1>
        <p className="text-gray-600 mt-1">
          Manage and analyze customer accounts
          {totalCount !== undefined && (
            <span className="ml-2 text-sm font-medium text-green-600">
              ({totalCount} {totalCount === 1 ? "customer" : "customers"})
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          className="border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
          onClick={onImportCustomers}
        >
          <Import className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Import Customers</span>
          <span className="sm:hidden">Import</span>
        </Button>

        <Button
          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white w-full sm:w-auto"
          onClick={onAddCustomer}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>
    </div>
  );
};
