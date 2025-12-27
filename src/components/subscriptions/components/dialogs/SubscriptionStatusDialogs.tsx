import { SubscriptionActivationDialog } from "./SubscriptionActivationDialog";
import { SubscriptionDeactivationDialog } from "./SubscriptionDeactivationDialog";

interface SubscriptionStatusDialogsProps {
  isDeactivationDialogOpen: boolean;
  isActivationDialogOpen: boolean;
  customerName: string;
  onConfirmDeactivation: () => void;
  onConfirmActivation: () => void;
  onCancelDeactivation: () => void;
  onCancelActivation: () => void;
}

export const SubscriptionStatusDialogs = ({
  isDeactivationDialogOpen,
  isActivationDialogOpen,
  customerName,
  onConfirmDeactivation,
  onConfirmActivation,
  onCancelDeactivation,
  onCancelActivation
}: SubscriptionStatusDialogsProps) => {
  return (
    <>
      <SubscriptionDeactivationDialog
        isOpen={isDeactivationDialogOpen}
        onClose={onCancelDeactivation}
        customerName={customerName}
        onConfirm={onConfirmDeactivation}
      />
      
      <SubscriptionActivationDialog
        isOpen={isActivationDialogOpen}
        onClose={onCancelActivation}
        customerName={customerName}
        onConfirm={onConfirmActivation}
      />
    </>
  );
};