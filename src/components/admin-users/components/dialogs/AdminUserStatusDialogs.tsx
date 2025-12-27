import { AdminUserActivationDialog } from "./AdminUserActivationDialog";
import { AdminUserDeactivationDialog } from "./AdminUserDeactivationDialog";

interface AdminUserStatusDialogsProps {
  isStatusWarningOpen: boolean;
  isActivateWarningOpen: boolean;
  userName: string;
  onConfirmStatusChange: () => void;
  onConfirmActivateChange: () => void;
  onCancelStatusChange: () => void;
  onCancelActivateChange: () => void;
}

export const AdminUserStatusDialogs = ({
  isStatusWarningOpen,
  isActivateWarningOpen,
  userName,
  onConfirmStatusChange,
  onConfirmActivateChange,
  onCancelStatusChange,
  onCancelActivateChange
}: AdminUserStatusDialogsProps) => {
  return (
    <>
      <AdminUserDeactivationDialog
        isOpen={isStatusWarningOpen}
        onClose={onCancelStatusChange}
        userName={userName}
        onConfirm={onConfirmStatusChange}
      />
      
      <AdminUserActivationDialog
        isOpen={isActivateWarningOpen}
        onClose={onCancelActivateChange}
        userName={userName}
        onConfirm={onConfirmActivateChange}
      />
    </>
  );
};