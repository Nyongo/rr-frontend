
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EnhancedTable } from "@/components/ui/enhanced-table";
import { Search } from "lucide-react";
import { Driver } from "@/components/fleet/types";
import { createDriverColumns } from "@/components/fleet/table-configs/driverColumns";

interface DriversTableProps {
  drivers: Driver[];
  onEditDriver: (driver: Driver) => void;
  onDeleteDriver: (driver: Driver) => void;
}

export const DriversTable = ({ drivers, onEditDriver, onDeleteDriver }: DriversTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const driverColumns = createDriverColumns(onEditDriver, onDeleteDriver);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Driver Personnel</h2>
        <p className="text-gray-600">Manage all drivers in your fleet</p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search drivers by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <EnhancedTable 
        data={filteredDrivers} 
        columns={driverColumns}
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
          showPageSizeSelector: true
        }}
      />
    </div>
  );
};
