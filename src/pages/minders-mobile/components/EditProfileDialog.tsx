
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { User, Phone } from "lucide-react";

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  currentName: string;
  currentPhone: string;
  onSave: (name: string, phone: string) => void;
}

const EditProfileDialog = ({
  open,
  onClose,
  currentName,
  currentPhone,
  onSave,
}: EditProfileDialogProps) => {
  const [name, setName] = useState(currentName);
  const [phone, setPhone] = useState(currentPhone);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Handle different input scenarios
    let formatted = '';
    
    if (cleaned.startsWith('254')) {
      // Already has country code 254
      if (cleaned.length <= 12) {
        formatted = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
      } else {
        formatted = cleaned.slice(0, 12).replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
      }
    } else if (cleaned.startsWith('0')) {
      // Starts with 0, replace with 254
      const withoutZero = cleaned.slice(1);
      if (withoutZero.length <= 9) {
        const fullNumber = '254' + withoutZero;
        formatted = fullNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
      } else {
        const fullNumber = '254' + withoutZero.slice(0, 9);
        formatted = fullNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
      }
    } else if (cleaned.length > 0) {
      // No country code, add 254
      if (cleaned.length <= 9) {
        const fullNumber = '254' + cleaned;
        formatted = fullNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
      } else {
        const fullNumber = '254' + cleaned.slice(0, 9);
        formatted = fullNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
      }
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(formatPhoneNumber(value));
  };

  const handleSave = () => {
    onSave(name, phone);
    onClose();
  };

  const handleCancel = () => {
    setName(currentName);
    setPhone(currentPhone);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <Input
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+254 712 345 678"
              className="w-full"
              maxLength={17}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || !phone.trim()}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
