
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EnhancedTable } from "@/components/ui/enhanced-table";
import { Search } from "lucide-react";
import { Minder } from "@/components/fleet/types";
import { createMinderColumns } from "@/components/fleet/table-configs/minderColumns";

interface MindersTableProps {
  minders: Minder[];
  onEditMinder: (minder: Minder) => void;
  onDeleteMinder: (minder: Minder) => void;
}

export const MindersTable = ({ minders, onEditMinder, onDeleteMinder }: MindersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMinders = minders.filter(minder =>
    minder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    minder.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    minder.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const minderColumns = createMinderColumns(onEditMinder, onDeleteMinder);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Minder Personnel</h2>
        <p className="text-gray-600">Manage all minders and supervisors</p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search minders by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <EnhancedTable 
        data={filteredMinders} 
        columns={minderColumns}
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
