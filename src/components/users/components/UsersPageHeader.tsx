
import { Button } from "@/components/ui/button";
import { Users as UsersIcon, Plus, Import } from "lucide-react";

interface UsersPageHeaderProps {
  onAddUser: () => void;
  onImportUsers: () => void;
}

export const UsersPageHeader = ({ onAddUser, onImportUsers }: UsersPageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <UsersIcon className="w-8 h-8 text-purple-600" />
          Users
        </h1>
        <p className="text-gray-600 mt-1">Manage school user accounts</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          className="border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
          onClick={onImportUsers}
        >
          <Import className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Import Users</span>
          <span className="sm:hidden">Import</span>
        </Button>
        
        <Button 
          className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white w-full sm:w-auto" 
          onClick={onAddUser}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>
    </div>
  );
};
