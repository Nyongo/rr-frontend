import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useSchools } from "@/hooks/useSchools";
import { FormItem } from "../types";

interface BusFormProps {
  newItem: FormItem;
  setNewItem: (item: FormItem) => void;
}

export const BusForm = ({ newItem, setNewItem }: BusFormProps) => {
  const { schools, loading: schoolsLoading } = useSchools();

  const schoolOptions = schools.map((school) => ({
    value: school.id,
    label: school.name,
  }));

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="registrationNumber">
          Registration Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="registrationNumber"
          placeholder="KCA 001A"
          value={newItem.registrationNumber}
          onChange={(e) =>
            setNewItem({ ...newItem, registrationNumber: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="schoolId">
          School <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          options={schoolOptions}
          value={newItem.schoolId || ""}
          onValueChange={(value) => {
            const selectedSchool = schools.find(
              (school) => school.id === value
            );
            setNewItem({
              ...newItem,
              schoolId: value,
              schoolName: selectedSchool?.name || "",
            });
          }}
          placeholder={
            schoolsLoading ? "Loading schools..." : "Select a school"
          }
          searchPlaceholder="Search schools..."
          emptyText="No school found."
          disabled={schoolsLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="make">
          Make <span className="text-red-500">*</span>
        </Label>
        <Input
          id="make"
          placeholder="Toyota"
          value={newItem.make}
          onChange={(e) => setNewItem({ ...newItem, make: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="model">
          Model <span className="text-red-500">*</span>
        </Label>
        <Input
          id="model"
          placeholder="Coaster"
          value={newItem.model}
          onChange={(e) => setNewItem({ ...newItem, model: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="seatsCapacity">
          Seats Capacity <span className="text-red-500">*</span>
        </Label>
        <Input
          id="seatsCapacity"
          type="number"
          placeholder="50"
          value={newItem.seatsCapacity}
          onChange={(e) =>
            setNewItem({ ...newItem, seatsCapacity: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">
          Type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={newItem.type}
          onValueChange={(value) => setNewItem({ ...newItem, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select bus type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Big Bus">Big Bus</SelectItem>
            <SelectItem value="Mini Bus">Mini Bus</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">
          Status <span className="text-red-500">*</span>
        </Label>
        <Select
          value={newItem.status}
          onValueChange={(value) => setNewItem({ ...newItem, status: value })}
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
