import { useState } from "react";
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
import PhotoUploadSection from "./components/PhotoUploadSection";

interface PersonFormProps {
  type: "driver" | "minder";
  newItem: FormItem;
  setNewItem: (item: FormItem) => void;
  isEditing?: boolean;
}

export const PersonForm = ({
  type,
  newItem,
  setNewItem,
  isEditing = false,
}: PersonFormProps) => {
  const [photoPreview, setPhotoPreview] = useState<string>(newItem.photo || "");
  const { schools, loading: schoolsLoading } = useSchools();

  const schoolOptions = schools.map((school) => ({
    value: school.id,
    label: school.name,
  }));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        setPhotoPreview(photoUrl);
        setNewItem({ ...newItem, photo: photoUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview("");
    setNewItem({ ...newItem, photo: "" });
  };

  return (
    <>
      <PhotoUploadSection
        photoPreview={photoPreview}
        onPhotoUpload={handlePhotoUpload}
        onRemovePhoto={removePhoto}
        type={type}
      />

      <div className="space-y-2">
        <Label htmlFor="name">
          {type === "driver" ? "Driver" : "Minder"} Name{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Enter full name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          placeholder="+254 722 123 456"
          value={newItem.phone}
          onChange={(e) => setNewItem({ ...newItem, phone: e.target.value })}
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
        <Label htmlFor="pin">
          Pin {isEditing ? "(Protected)" : "4-digit PIN"}
        </Label>
        {isEditing ? (
          <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
            Pin cannot be edited through this form for security reasons.
          </div>
        ) : type === "minder" ? (
          <Input
            id="pin"
            placeholder="1234"
            value={newItem.pin || ""}
            onChange={(e) => setNewItem({ ...newItem, pin: e.target.value })}
            maxLength={4}
            pattern="[0-9]{4}"
          />
        ) : (
          <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
            A 4-digit pin will be automatically generated for this driver.
          </div>
        )}
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
