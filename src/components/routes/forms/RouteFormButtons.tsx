
import { Button } from "@/components/ui/button";
import { RouteData } from "../RoutesTab";

interface RouteFormButtonsProps {
  onCancel: () => void;
  editingRoute?: RouteData | null;
}

const RouteFormButtons = ({ onCancel, editingRoute }: RouteFormButtonsProps) => {
  return (
    <div className="flex justify-end space-x-4 pt-6 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
        {editingRoute ? 'Update Route' : 'Create Route'}
      </Button>
    </div>
  );
};

export default RouteFormButtons;
