
import { useState } from "react";

export const useParentDialogs = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusWarningOpen, setIsStatusWarningOpen] = useState(false);
  const [isActivateWarningOpen, setIsActivateWarningOpen] = useState(false);

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isImportDialogOpen,
    setIsImportDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isStatusWarningOpen,
    setIsStatusWarningOpen,
    isActivateWarningOpen,
    setIsActivateWarningOpen,
  };
};
