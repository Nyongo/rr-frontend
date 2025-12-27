import { useState } from "react";
import { Customer, CustomerFormItem } from "../types";

interface UseCustomerStatusActionsProps {
  proceedWithUpdate: (customer: Customer, data: CustomerFormItem) => boolean;
  setIsDeactivationDialogOpen: (open: boolean) => void;
  setIsActivationDialogOpen: (open: boolean) => void;
}

export const useCustomerStatusActions = ({
  proceedWithUpdate,
  setIsDeactivationDialogOpen,
  setIsActivationDialogOpen,
}: UseCustomerStatusActionsProps) => {
  const [pendingCustomer, setPendingCustomer] = useState<Customer | null>(null);
  const [pendingData, setPendingData] = useState<CustomerFormItem | null>(null);

  const handleUpdateItem = (
    e: React.FormEvent,
    customer: Customer | null,
    data: CustomerFormItem
  ) => {
    e.preventDefault();
    if (!customer) return false;

    // Check if status is being changed to inactive
    if (data.status === "inactive" && customer.status === "active") {
      setPendingCustomer(customer);
      setPendingData(data);
      setIsDeactivationDialogOpen(true);
      return false;
    }

    // Check if status is being changed to active
    if (data.status === "active" && customer.status === "inactive") {
      setPendingCustomer(customer);
      setPendingData(data);
      setIsActivationDialogOpen(true);
      return false;
    }

    // Normal update for other changes
    return proceedWithUpdate(customer, data);
  };

  const handleConfirmStatusChange = () => {
    if (pendingCustomer && pendingData) {
      proceedWithUpdate(pendingCustomer, pendingData);
      resetPendingData();
      return true;
    }
    return false;
  };

  const handleConfirmActivateChange = () => {
    if (pendingCustomer && pendingData) {
      proceedWithUpdate(pendingCustomer, pendingData);
      resetPendingData();
      return true;
    }
    return false;
  };

  const handleCancelStatusChange = () => {
    setIsDeactivationDialogOpen(false);
    resetPendingData();
  };

  const handleCancelActivateChange = () => {
    setIsActivationDialogOpen(false);
    resetPendingData();
  };

  const resetPendingData = () => {
    setPendingCustomer(null);
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