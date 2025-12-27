import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useSchools } from "@/hooks/useSchools";
import { ParentFormItem } from "../types";

interface ParentFormProps {
  newItem: ParentFormItem;
  setNewItem: (item: ParentFormItem) => void;
  isEditing?: boolean;
}

export const ParentForm = ({
  newItem,
  setNewItem,
  isEditing = false,
}: ParentFormProps) => {
  const { schools, loading: schoolsLoading } = useSchools();

  const schoolOptions = schools.map((school) => ({
    value: school.id,
    label: school.name,
  }));

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">
          Parent Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Enter parent's full name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="parentType">
          Parent Type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={newItem.parentType}
          onValueChange={(value: "Mother" | "Father" | "Guardian") =>
            setNewItem({ ...newItem, parentType: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select parent type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mother">Mother</SelectItem>
            <SelectItem value="Father">Father</SelectItem>
            <SelectItem value="Guardian">Guardian</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phoneNumber"
          placeholder="+254 7XX XXX XXX"
          value={newItem.phoneNumber || newItem.phone || ""}
          onChange={(e) =>
            setNewItem({
              ...newItem,
              phoneNumber: e.target.value,
              phone: e.target.value,
            })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address (Optional)</Label>
        <Input
          id="email"
          type="email"
          placeholder="parent@email.com"
          value={newItem.email || ""}
          onChange={(e) =>
            setNewItem({ ...newItem, email: e.target.value || undefined })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="schoolId">
          School <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          options={schoolOptions}
          value={newItem.schoolId || ""}
          onValueChange={(value) => setNewItem({ ...newItem, schoolId: value })}
          placeholder={
            schoolsLoading ? "Loading schools..." : "Select a school"
          }
          searchPlaceholder="Search schools..."
          emptyText="No school found."
          disabled={schoolsLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">
          Status <span className="text-red-500">*</span>
        </Label>
        <Select
          value={newItem.status}
          onValueChange={(value: "Active" | "Inactive") =>
            setNewItem({ ...newItem, status: value })
          }
        >
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
