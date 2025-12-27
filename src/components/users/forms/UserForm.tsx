
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { schools } from "@/components/fleet/data/schools";
import { UserFormItem } from "../types";

interface UserFormProps {
  newItem: UserFormItem;
  setNewItem: (item: UserFormItem) => void;
  isEditing?: boolean;
}

export const UserForm = ({ newItem, setNewItem, isEditing = false }: UserFormProps) => {
  const schoolOptions = schools.map(school => ({
    value: school,
    label: school
  }));

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="Enter user's full name"
          value={newItem.fullName}
          onChange={(e) => setNewItem({ ...newItem, fullName: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="user@email.com"
          value={newItem.email}
          onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          placeholder="+254 7XX XXX XXX"
          value={newItem.phone}
          onChange={(e) => setNewItem({ ...newItem, phone: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="schoolName">
          School Name <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          options={schoolOptions}
          value={newItem.schoolName}
          onValueChange={(value) => setNewItem({ ...newItem, schoolName: value })}
          placeholder="Select a school..."
          searchPlaceholder="Search schools..."
          emptyText="No school found."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">
          Role <span className="text-red-500">*</span>
        </Label>
        <Select value={newItem.role} onValueChange={(value: "Admin" | "User") => setNewItem({ ...newItem, role: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="User">User</SelectItem>
          </SelectContent>
        </Select>
        {newItem.role && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
            {newItem.role === "Admin" 
              ? "Admin users have full rights to create and edit records under the account."
              : "User will have only read or view rights and not create and edit."
            }
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">
          Status <span className="text-red-500">*</span>
        </Label>
        <Select value={newItem.status} onValueChange={(value: "Active" | "Inactive") => setNewItem({ ...newItem, status: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
