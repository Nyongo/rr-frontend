
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EnhancedTable } from "@/components/ui/enhanced-table";
import { Search } from "lucide-react";
import { Bus } from "@/components/fleet/types";
import { createBusColumns } from "@/components/fleet/table-configs/busColumns";

interface BusesTableProps {
  buses: Bus[];
  onEditBus: (bus: Bus) => void;
  onDeleteBus: (bus: Bus) => void;
}

export const BusesTable = ({ buses, onEditBus, onDeleteBus }: BusesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBuses = buses.filter(bus =>
    bus.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const busColumns = createBusColumns(onEditBus, onDeleteBus);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Bus Fleet</h2>
        <p className="text-gray-600">Manage all buses in your fleet</p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search buses by registration, make, or school..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <EnhancedTable 
        data={filteredBuses} 
        columns={busColumns}
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
