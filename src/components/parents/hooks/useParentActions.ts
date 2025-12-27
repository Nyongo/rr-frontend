import { useParentsData } from "./useParentsData";
import { useParentDialogs } from "./useParentDialogs";
import { useParentForm } from "./useParentForm";
import { useParentStatusActions } from "./useParentStatusActions";
import { useParentCrudActions } from "./useParentCrudActions";

export const useParentActions = () => {
  const { parents, loading, refetch } = useParentsData();

  const dialogStates = useParentDialogs();

  const formActions = useParentForm();

  const statusActions = useParentStatusActions({
    proceedWithUpdate: formActions.proceedWithUpdate,
    setIsStatusWarningOpen: dialogStates.setIsStatusWarningOpen,
    setIsActivateWarningOpen: dialogStates.setIsActivateWarningOpen,
  });

  const crudActions = useParentCrudActions({
    setIsDeleteDialogOpen: dialogStates.setIsDeleteDialogOpen,
    setIsImportDialogOpen: dialogStates.setIsImportDialogOpen,
  });

  const handleAddDialogOpen = () => {
    formActions.handleAddDialogOpen();
    dialogStates.setIsAddDialogOpen(true);
  };

  const handleAddParent = async (e: React.FormEvent) => {
    const success = await formActions.handleAddParent(e);
    if (success) {
      dialogStates.setIsAddDialogOpen(false);
      // Note: Parents are already refetched in useParentsData.addParent
    }
  };

  const handleEditItem = (item: any) => {
    formActions.handleEditItem(item);
    dialogStates.setIsEditDialogOpen(true);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    const success = statusActions.handleUpdateItem(
      e,
      formActions.editingItem,
      formActions.newItem
    );
    if (success) {
      dialogStates.setIsEditDialogOpen(false);
    }
  };

  return {
    // Data
    parents,
    loading,
    newItem: formActions.newItem,
    setNewItem: formActions.setNewItem,
    editingItem: formActions.editingItem,
    itemToDelete: crudActions.itemToDelete,
    pendingUpdate: statusActions.pendingUpdate,

    // Dialog states
    ...dialogStates,

    // Actions
    handleAddDialogOpen,
    handleAddParent,
    handleEditItem,
    handleUpdateItem,
    handleDeleteItem: crudActions.handleDeleteItem,
    confirmDelete: crudActions.confirmDelete,
    handleImport: crudActions.handleImport,
    handleParentClick: crudActions.handleParentClick,
    handleRowClick: crudActions.handleRowClick,
    handleConfirmStatusChange: statusActions.handleConfirmStatusChange,
    handleConfirmActivateChange: statusActions.handleConfirmActivateChange,
    handleCancelStatusChange: statusActions.handleCancelStatusChange,
    handleCancelActivateChange: statusActions.handleCancelActivateChange,
    refetch,
  };
};
