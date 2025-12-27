
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Parent, ParentFormItem } from "../types";

interface UseParentStatusActionsProps {
  proceedWithUpdate: (parent: Parent, data: ParentFormItem) => boolean;
  setIsStatusWarningOpen: (open: boolean) => void;
  setIsActivateWarningOpen: (open: boolean) => void;
}

export const useParentStatusActions = ({
  proceedWithUpdate,
  setIsStatusWarningOpen,
  setIsActivateWarningOpen,
}: UseParentStatusActionsProps) => {
  const [pendingUpdate, setPendingUpdate] = useState<{ parent: Parent; data: ParentFormItem } | null>(null);

  const handleUpdateItem = (e: React.FormEvent, editingItem: Parent | null, newItem: ParentFormItem) => {
    e.preventDefault();
    if (editingItem) {
      // Check if status is being changed to Inactive
      if (editingItem.status === "Active" && newItem.status === "Inactive") {
        setPendingUpdate({ parent: editingItem, data: newItem });
        setIsStatusWarningOpen(true);
        return false; // Don't close dialog yet
      }
      
      // Check if status is being changed to Active
      if (editingItem.status === "Inactive" && newItem.status === "Active") {
        setPendingUpdate({ parent: editingItem, data: newItem });
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
      proceedWithUpdate(pendingUpdate.parent, pendingUpdate.data);
      toast({
        title: "Parent Status Updated!",
        description: "Parent and associated students have been deactivated and hidden from assigned routes.",
      });
    }
    setIsStatusWarningOpen(false);
    setPendingUpdate(null);
  };

  const handleConfirmActivateChange = () => {
    if (pendingUpdate) {
      proceedWithUpdate(pendingUpdate.parent, pendingUpdate.data);
      toast({
        title: "Parent Status Updated!",
        description: "Parent and associated students have been activated and made visible on assigned routes.",
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
