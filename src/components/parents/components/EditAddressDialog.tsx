
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Address {
  id: number;
  type: string;
  location: string;
  longitude: string;
  latitude: string;
  status: string;
  isPrimary: boolean;
}

interface EditAddressDialogProps {
  address: Address;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedAddress: Address) => void;
}

const EditAddressDialog = ({ address, isOpen, onClose, onUpdate }: EditAddressDialogProps) => {
  const [editData, setEditData] = useState({
    type: address.type,
    location: address.location,
    status: address.status,
    isPrimary: address.isPrimary ? "true" : "false",
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAddress = {
      ...address,
      ...editData,
      isPrimary: editData.isPrimary === "true",
    };
    onUpdate(updatedAddress);
    onClose();
    toast({
      title: "Address Updated!",
      description: "Address has been successfully updated.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
          <DialogDescription>
            Update the address information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Address Type</Label>
            <Select value={editData.type} onValueChange={(value) => setEditData({ ...editData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Relative">Relative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter full address"
              value={editData.location}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={editData.status} onValueChange={(value) => setEditData({ ...editData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Primary Address</Label>
            <RadioGroup 
              value={editData.isPrimary} 
              onValueChange={(value) => setEditData({ ...editData, isPrimary: value })}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="edit-primary-yes" />
                <Label htmlFor="edit-primary-yes" className="text-sm font-normal">Yes, make this primary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="edit-primary-no" />
                <Label htmlFor="edit-primary-no" className="text-sm font-normal">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Update Address
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAddressDialog;
