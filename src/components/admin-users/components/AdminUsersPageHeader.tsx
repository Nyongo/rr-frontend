import { Button } from "@/components/ui/button";
import { UserCheck, Plus } from "lucide-react";

interface AdminUsersPageHeaderProps {
  onAddUser: () => void;
  totalCount?: number;
}

export const AdminUsersPageHeader = ({
  onAddUser,
  totalCount,
}: AdminUsersPageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <UserCheck className="w-8 h-8 text-orange-600" />
          Users
        </h1>
        <p className="text-gray-600 mt-1">
          Manage admin user accounts
          {totalCount !== undefined && (
            <span className="ml-2 text-sm">
              ({totalCount} {totalCount === 1 ? "user" : "users"})
            </span>
          )}
        </p>
      </div>

      <div className="w-full sm:w-auto">
        <Button
          className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white w-full sm:w-auto"
          onClick={onAddUser}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>
    </div>
  );
};
