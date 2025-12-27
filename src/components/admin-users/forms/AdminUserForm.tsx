import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserFormItem } from "../types";

interface AdminUserFormProps {
  newItem: UserFormItem;
  setNewItem: (item: UserFormItem) => void;
  isEditing?: boolean;
  roles?: any[];
}

export const AdminUserForm = ({
  newItem,
  setNewItem,
  isEditing = false,
  roles = [],
}: AdminUserFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleRoleChange = (value: string) => {
    setNewItem({ ...newItem, roleId: parseInt(value) });
  };

  const handleStatusChange = (value: "Active" | "Inactive") => {
    setNewItem({ ...newItem, isActive: value === "Active" });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={newItem.name}
          onChange={handleChange}
          placeholder="Enter full name"
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={newItem.email}
          onChange={handleChange}
          placeholder="Enter email address"
          className="mt-1"
          required
          disabled={isEditing}
        />
        {isEditing && (
          <p className="text-sm text-gray-500 mt-1">
            Email cannot be changed after user creation
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          value={newItem.phoneNumber || ""}
          onChange={handleChange}
          placeholder="Enter phone number (optional)"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={newItem.roleId.toString()}
          onValueChange={handleRoleChange}
        >
          <SelectTrigger id="role" className="mt-1">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id.toString()}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={newItem.isActive ? "Active" : "Inactive"}
          onValueChange={(value: "Active" | "Inactive") =>
            handleStatusChange(value)
          }
        >
          <SelectTrigger id="status" className="mt-1">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
