
import { Button } from "@/components/ui/button";
import { Bus, Plus, Import } from "lucide-react";

interface FleetPageHeaderProps {
  onAddItem: () => void;
  onImportData: () => void;
  activeTab: string;
}

export const FleetPageHeader = ({ onAddItem, onImportData, activeTab }: FleetPageHeaderProps) => {
  const getTitle = () => {
    switch(activeTab) {
      case "buses": return "Fleet Management";
      case "drivers": return "Driver Management";
      case "minders": return "Minder Management";
      default: return "Fleet & Crew";
    }
  };

  const getButtonText = () => {
    switch(activeTab) {
      case "buses": return "Add Bus";
      case "drivers": return "Add Driver";
      case "minders": return "Add Minder";
      default: return "Add Item";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Bus className="w-8 h-8 text-orange-600" />
          {getTitle()}
        </h1>
        <p className="text-gray-600 mt-1">Manage your transportation fleet and crew</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button 
          variant="outline"
          className="border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
          onClick={onImportData}
        >
          <Import className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Import Data</span>
          <span className="sm:hidden">Import</span>
        </Button>
        
        <Button 
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white w-full sm:w-auto"
          onClick={onAddItem}
        >
          <Plus className="w-4 h-4 mr-2" />
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};
