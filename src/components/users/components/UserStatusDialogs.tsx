
import { UserActivationDialog } from "./UserActivationDialog";
import { UserDeactivationDialog } from "./UserDeactivationDialog";

interface UserStatusDialogsProps {
  isStatusWarningOpen: boolean;
  isActivateWarningOpen: boolean;
  userName: string;
  onConfirmStatusChange: () => void;
  onConfirmActivateChange: () => void;
  onCancelStatusChange: () => void;
  onCancelActivateChange: () => void;
}

export const UserStatusDialogs = ({
  isStatusWarningOpen,
  isActivateWarningOpen,
  userName,
  onConfirmStatusChange,
  onConfirmActivateChange,
  onCancelStatusChange,
  onCancelActivateChange,
}: UserStatusDialogsProps) => {
  return (
    <>
      <UserDeactivationDialog
        isOpen={isStatusWarningOpen}
        userName={userName}
        onConfirm={onConfirmStatusChange}
        onClose={onCancelStatusChange}
      />

      <UserActivationDialog
        isOpen={isActivateWarningOpen}
        userName={userName}
        onConfirm={onConfirmActivateChange}
        onClose={onCancelActivateChange}
      />
    </>
  );
};
