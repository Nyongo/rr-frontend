import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Parent } from "../types";
import { useParentsData } from "./useParentsData";

interface UseParentCrudActionsProps {
  setIsDeleteDialogOpen: (open: boolean) => void;
  setIsImportDialogOpen: (open: boolean) => void;
}

export const useParentCrudActions = ({
  setIsDeleteDialogOpen,
  setIsImportDialogOpen,
}: UseParentCrudActionsProps) => {
  const navigate = useNavigate();
  const { deleteParent } = useParentsData();
  const [itemToDelete, setItemToDelete] = useState<Parent | null>(null);

  const handleDeleteItem = (item: Parent) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteParent(itemToDelete);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleImport = () => {
    // Import dialog is now handled by ParentImportDialog component
    // This function is kept for backward compatibility but does nothing
    // The actual import logic is in ParentImportDialog
  };

  const handleParentClick = (parentId: string) => {
    navigate(`/parent-details/${parentId}`);
  };

  const handleRowClick = (parent: Parent) => {
    handleParentClick(parent.id);
  };

  return {
    itemToDelete,
    handleDeleteItem,
    confirmDelete,
    handleImport,
    handleParentClick,
    handleRowClick,
  };
};
