import { CustomerActivationDialog } from "./CustomerActivationDialog";
import { CustomerDeactivationDialog } from "./CustomerDeactivationDialog";

interface CustomerStatusDialogsProps {
  isDeactivationDialogOpen: boolean;
  isActivationDialogOpen: boolean;
  customerName: string;
  onConfirmDeactivation: () => void;
  onConfirmActivation: () => void;
  onCancelDeactivation: () => void;
  onCancelActivation: () => void;
}

export const CustomerStatusDialogs = ({
  isDeactivationDialogOpen,
  isActivationDialogOpen,
  customerName,
  onConfirmDeactivation,
  onConfirmActivation,
  onCancelDeactivation,
  onCancelActivation
}: CustomerStatusDialogsProps) => {
  return (
    <>
      <CustomerDeactivationDialog
        isOpen={isDeactivationDialogOpen}
        onClose={onCancelDeactivation}
        customerName={customerName}
        onConfirm={onConfirmDeactivation}
      />
      
      <CustomerActivationDialog
        isOpen={isActivationDialogOpen}
        onClose={onCancelActivation}
        customerName={customerName}
        onConfirm={onConfirmActivation}
      />
    </>
  );
};