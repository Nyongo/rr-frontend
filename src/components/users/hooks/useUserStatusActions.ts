
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { User, UserFormItem } from "../types";

interface UseUserStatusActionsProps {
  proceedWithUpdate: (user: User, data: UserFormItem) => boolean;
  setIsStatusWarningOpen: (open: boolean) => void;
  setIsActivateWarningOpen: (open: boolean) => void;
}

export const useUserStatusActions = ({
  proceedWithUpdate,
  setIsStatusWarningOpen,
  setIsActivateWarningOpen,
}: UseUserStatusActionsProps) => {
  const [pendingUpdate, setPendingUpdate] = useState<{ user: User; data: UserFormItem } | null>(null);

  const handleUpdateItem = (e: React.FormEvent, editingItem: User | null, newItem: UserFormItem) => {
    e.preventDefault();
    if (editingItem) {
      // Check if status is being changed to Inactive
      if (editingItem.status === "Active" && newItem.status === "Inactive") {
        setPendingUpdate({ user: editingItem, data: newItem });
        setIsStatusWarningOpen(true);
        return false; // Don't close dialog yet
      }
      
      // Check if status is being changed to Active
      if (editingItem.status === "Inactive" && newItem.status === "Active") {
        setPendingUpdate({ user: editingItem, data: newItem });
        setIsActivateWarningOpen(true);
        return false; // Don't close dialog yet
      }
      
      // If no status change or other status changes, proceed normally
      return proceedWithUpdate(editingItem, newItem);
    }
    return false;
  };

  const handleConfirmStatusChange = () => {
    if (pendingUpdate) {
      proceedWithUpdate(pendingUpdate.user, pendingUpdate.data);
      toast({
        title: "User Status Updated!",
        description: "User's session has been logged out and they cannot log in to their account.",
      });
    }
    setIsStatusWarningOpen(false);
    setPendingUpdate(null);
  };

  const handleConfirmActivateChange = () => {
    if (pendingUpdate) {
      proceedWithUpdate(pendingUpdate.user, pendingUpdate.data);
      toast({
        title: "User Status Updated!",
        description: "User can now log back into their account.",
      });
    }
    setIsActivateWarningOpen(false);
    setPendingUpdate(null);
  };

  const handleCancelStatusChange = () => {
    setIsStatusWarningOpen(false);
    setPendingUpdate(null);
  };

  const handleCancelActivateChange = () => {
    setIsActivateWarningOpen(false);
    setPendingUpdate(null);
  };

  return {
    pendingUpdate,
    handleUpdateItem,
    handleConfirmStatusChange,
    handleConfirmActivateChange,
    handleCancelStatusChange,
    handleCancelActivateChange,
  };
};
