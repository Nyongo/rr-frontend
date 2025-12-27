
import { Button } from "@/components/ui/button";
import { Plus, Route } from "lucide-react";

interface RoutesHeaderProps {
  onAddRoute: () => void;
}

const RoutesHeader = ({ onAddRoute }: RoutesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Route className="w-6 h-6 text-blue-600" />
          Bus Routes
        </h2>
        <p className="text-gray-600 mt-1">
          Manage bus routes and student pickup/drop-off schedules
        </p>
      </div>
      <Button 
        onClick={onAddRoute}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto"
      >
        <Plus className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Add Route</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </div>
  );
};

export default RoutesHeader;
