
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EnhancedTable } from "@/components/ui/enhanced-table";
import { Search } from "lucide-react";
import { User } from "../types";
import { createUserColumns } from "../table-configs/userColumns";

interface UsersTableSectionProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export const UsersTableSection = ({ users, onEditUser, onDeleteUser }: UsersTableSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userColumns = createUserColumns(onEditUser, onDeleteUser);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input 
          placeholder="Search users by name, email, or phone..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          className="pl-10" 
        />
      </div>

      {/* Users Table */}
      <EnhancedTable 
        data={filteredUsers} 
        columns={userColumns}
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
