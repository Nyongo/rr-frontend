
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
import { Key, Eye, EyeOff } from "lucide-react";

interface ChangePinDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (newPin: string) => void;
}

const ChangePinDialog = ({ open, onClose, onSave }: ChangePinDialogProps) => {
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const handleSave = () => {
    if (newPin === confirmPin && newPin.length === 4) {
      onSave(newPin);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setNewPin("");
    setConfirmPin("");
    setShowPin(false);
    setShowConfirmPin(false);
    onClose();
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setNewPin(value);
    }
  };

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setConfirmPin(value);
    }
  };

  const pinsMatch = newPin === confirmPin && newPin.length === 4;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Key className="w-5 h-5 text-green-600" />
            Change PIN
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              New PIN (4 digits)
            </label>
            <div className="relative">
              <Input
                type={showPin ? "text" : "password"}
                value={newPin}
                onChange={handlePinChange}
                placeholder="****"
                className="w-full text-center text-lg font-mono tracking-widest pr-10"
                maxLength={4}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Confirm PIN
            </label>
            <div className="relative">
              <Input
                type={showConfirmPin ? "text" : "password"}
                value={confirmPin}
                onChange={handleConfirmPinChange}
                placeholder="****"
                className="w-full text-center text-lg font-mono tracking-widest pr-10"
                maxLength={4}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {newPin.length === 4 && confirmPin.length === 4 && newPin !== confirmPin && (
            <p className="text-sm text-red-600">PINs do not match</p>
          )}
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
            disabled={!pinsMatch}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Save PIN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePinDialog;
