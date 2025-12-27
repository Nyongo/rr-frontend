import { useState } from "react";
import { Subscription, SubscriptionFormItem } from "../types";

interface UseSubscriptionStatusActionsProps {
  proceedWithUpdate: (subscription: Subscription, data: SubscriptionFormItem) => boolean;
  setIsDeactivationDialogOpen: (open: boolean) => void;
  setIsActivationDialogOpen: (open: boolean) => void;
}

export const useSubscriptionStatusActions = ({
  proceedWithUpdate,
  setIsDeactivationDialogOpen,
  setIsActivationDialogOpen,
}: UseSubscriptionStatusActionsProps) => {
  const [pendingSubscription, setPendingSubscription] = useState<Subscription | null>(null);
  const [pendingData, setPendingData] = useState<SubscriptionFormItem | null>(null);

  const handleUpdateItem = (
    e: React.FormEvent,
    subscription: Subscription | null,
    data: SubscriptionFormItem
  ) => {
    e.preventDefault();
    if (!subscription) return false;

    try {
      // Check if status is being changed to cancelled
      if (data.status === "cancelled" && subscription.status === "active") {
        setPendingSubscription(subscription);
        setPendingData(data);
        setIsDeactivationDialogOpen(true);
        return false;
      }

      // Check if status is being changed to active
      if (data.status === "active" && subscription.status === "cancelled") {
        setPendingSubscription(subscription);
        setPendingData(data);
        setIsActivationDialogOpen(true);
        return false;
      }

      // Normal update for other changes
      return proceedWithUpdate(subscription, data);
    } catch (error) {
      // Let the error propagate up to be handled by the parent component
      throw error;
    }
  };

  const handleConfirmStatusChange = () => {
    if (pendingSubscription && pendingData) {
      try {
        const result = proceedWithUpdate(pendingSubscription, pendingData);
        resetPendingData();
        return result;
      } catch (error) {
        // Let the error propagate up to be handled by the parent component
        resetPendingData();
        throw error;
      }
    }
    return false;
  };

  const handleConfirmActivateChange = () => {
    if (pendingSubscription && pendingData) {
      try {
        const result = proceedWithUpdate(pendingSubscription, pendingData);
        resetPendingData();
        return result;
      } catch (error) {
        // Let the error propagate up to be handled by the parent component
        resetPendingData();
        throw error;
      }
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
    setPendingSubscription(null);
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