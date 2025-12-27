import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerFormItem } from "../types";
import { Upload } from "lucide-react";
import { useState } from "react";

interface CustomerFormProps {
  newItem: CustomerFormItem;
  setNewItem: (item: CustomerFormItem) => void;
  isEditing?: boolean;
}

export const CustomerForm = ({
  newItem,
  setNewItem,
  isEditing = false,
}: CustomerFormProps) => {
  const [logoFileName, setLogoFileName] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFileName(e.target.files[0].name);
      setNewItem({ ...newItem, companyLogo: e.target.files[0] });
    }
  };

  const handleStatusChange = (value: "Active" | "Inactive") => {
    setNewItem({ ...newItem, isActive: value === "Active" });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="logo">Company Logo (Optional)</Label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="logo"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {logoFileName ? (
                <>
                  <Upload className="w-8 h-8 mb-2 text-green-500" />
                  <p className="mb-2 text-sm text-green-600 font-medium">
                    {logoFileName}
                  </p>
                  <p className="text-xs text-gray-500">Click to change</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG or JPEG (MAX. 5MB)
                  </p>
                </>
              )}
            </div>
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          value={newItem.companyName}
          onChange={handleChange}
          placeholder="Enter company name"
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="contactPerson">Contact Person</Label>
        <Input
          id="contactPerson"
          name="contactPerson"
          value={newItem.contactPerson}
          onChange={handleChange}
          placeholder="Enter contact person name"
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={newItem.phoneNumber}
          onChange={handleChange}
          placeholder="Enter phone number"
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="emailAddress">Email Address</Label>
        <Input
          id="emailAddress"
          name="emailAddress"
          type="email"
          value={newItem.emailAddress}
          onChange={handleChange}
          placeholder="Enter email address"
          className="mt-1"
          required
          disabled={isEditing}
        />
        {isEditing && (
          <p className="text-sm text-gray-500 mt-1">
            Email cannot be changed after customer creation
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="numberOfSchools">No. of Schools</Label>
        <Input
          id="numberOfSchools"
          name="numberOfSchools"
          type="number"
          value={newItem.numberOfSchools}
          onChange={handleChange}
          placeholder="Enter number of schools"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter the number of schools for this customer.
        </p>
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
