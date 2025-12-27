import { useState } from "react";
import { User, UserFormItem } from "../types";

interface UseAdminUserStatusActionsProps {
  proceedWithUpdate: (user: User, data: UserFormItem) => boolean;
  setIsStatusWarningOpen: (open: boolean) => void;
  setIsActivateWarningOpen: (open: boolean) => void;
}

export const useAdminUserStatusActions = ({
  proceedWithUpdate,
  setIsStatusWarningOpen,
  setIsActivateWarningOpen,
}: UseAdminUserStatusActionsProps) => {
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [pendingData, setPendingData] = useState<UserFormItem | null>(null);

  const handleUpdateItem = (
    e: React.FormEvent,
    user: User | null,
    data: UserFormItem
  ) => {
    e.preventDefault();
    if (!user) return false;

    // Check if status is being changed to Inactive
    if (data.status === "Inactive" && user.status === "Active") {
      setPendingUser(user);
      setPendingData(data);
      setIsStatusWarningOpen(true);
      return false;
    }

    // Check if status is being changed to Active
    if (data.status === "Active" && user.status === "Inactive") {
      setPendingUser(user);
      setPendingData(data);
      setIsActivateWarningOpen(true);
      return false;
    }

    // Normal update for other changes
    return proceedWithUpdate(user, data);
  };

  const handleConfirmStatusChange = () => {
    if (pendingUser && pendingData) {
      proceedWithUpdate(pendingUser, pendingData);
      resetPendingData();
      return true;
    }
    return false;
  };

  const handleConfirmActivateChange = () => {
    if (pendingUser && pendingData) {
      proceedWithUpdate(pendingUser, pendingData);
      resetPendingData();
      return true;
    }
    return false;
  };

  const handleCancelStatusChange = () => {
    setIsStatusWarningOpen(false);
    resetPendingData();
  };

  const handleCancelActivateChange = () => {
    setIsActivateWarningOpen(false);
    resetPendingData();
  };

  const resetPendingData = () => {
    setPendingUser(null);
    setPendingData(null);
  };

  return {
    handleUpdateItem,
    handleConfirmStatusChange,
    handleConfirmActivateChange,
    handleCancelStatusChange,
    handleCancelActivateChange,
  };
};