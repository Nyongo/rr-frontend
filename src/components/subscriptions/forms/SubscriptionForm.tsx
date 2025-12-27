import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubscriptionFormItem } from "../types";
import { CustomSearchableSelect } from "@/components/terms/CustomSearchableSelect";

interface SubscriptionFormProps {
  newItem: SubscriptionFormItem;
  setNewItem: (item: SubscriptionFormItem) => void;
  isEditing?: boolean;
  customerOptions: { value: string; label: string }[];
}

export const SubscriptionForm = ({ 
  newItem, 
  setNewItem, 
  isEditing = false,
  customerOptions
}: SubscriptionFormProps) => {
  const [fromStudentsError, setFromStudentsError] = useState("");
  const [toStudentsError, setToStudentsError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "fromStudents" || name === "toStudents" || name === "pricePerTerm") {
      setNewItem({ ...newItem, [name]: parseInt(value) || 0 });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  const handleCustomerChange = (customerId: string) => {
    setNewItem({ ...newItem, customerId });
  };

  const handleStatusChange = (value: 'active' | 'cancelled') => {
    setNewItem({ ...newItem, status: value });
  };

  // Validate from and to student range
  useEffect(() => {
    // Reset errors
    setFromStudentsError("");
    setToStudentsError("");

    if (newItem.fromStudents < 1) {
      setFromStudentsError("Minimum value is 1");
    }

    if (newItem.toStudents <= newItem.fromStudents) {
      setToStudentsError("Must be greater than 'From Students'");
    }
  }, [newItem.fromStudents, newItem.toStudents]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="customerId">Company Name</Label>
        <div className="mt-1">
          <CustomSearchableSelect
            options={customerOptions}
            value={newItem.customerId}
            onValueChange={handleCustomerChange}
            placeholder="Select company..."
            emptyText="No companies found."
            searchPlaceholder="Search companies..."
            hasError={!newItem.customerId}
          />
          {!newItem.customerId && (
            <p className="text-xs text-red-500 mt-1">Company is required</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fromStudents">From Students</Label>
          <Input 
            id="fromStudents" 
            name="fromStudents" 
            type="number"
            min={1}
            value={newItem.fromStudents} 
            onChange={handleChange} 
            placeholder="Enter minimum students"
            className={`mt-1 ${fromStudentsError ? "border-red-500" : ""}`}
            required
          />
          {fromStudentsError && (
            <p className="text-xs text-red-500 mt-1">{fromStudentsError}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="toStudents">To Students</Label>
          <Input 
            id="toStudents" 
            name="toStudents" 
            type="number"
            min={newItem.fromStudents + 1}
            value={newItem.toStudents} 
            onChange={handleChange} 
            placeholder="Enter maximum students"
            className={`mt-1 ${toStudentsError ? "border-red-500" : ""}`}
            required
          />
          {toStudentsError && (
            <p className="text-xs text-red-500 mt-1">{toStudentsError}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="pricePerTerm">Price per Term (KES)</Label>
        <Input 
          id="pricePerTerm" 
          name="pricePerTerm" 
          type="number"
          min={0}
          value={newItem.pricePerTerm} 
          onChange={handleChange} 
          placeholder="Enter price per term"
          className="mt-1"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="status">Status</Label>
        <Select 
          value={newItem.status} 
          onValueChange={(value: 'active' | 'cancelled') => handleStatusChange(value)}
        >
          <SelectTrigger id="status" className="mt-1">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};