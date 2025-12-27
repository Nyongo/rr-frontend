import { useState } from "react";
import Layout from "@/components/Layout";
import { toast } from "@/hooks/use-toast";
import { AdminUser, UserFormItem } from "@/components/admin-users/types";
import { useAdminUsersData } from "@/components/admin-users/hooks/useAdminUsersData";
import { useAdminUserStatusActions } from "@/components/admin-users/hooks/useAdminUserStatusActions";
import { AdminUsersPageHeader } from "@/components/admin-users/components/AdminUsersPageHeader";
import { AdminUsersTableSection } from "@/components/admin-users/components/AdminUsersTableSection";
import { AdminUsersDialogs } from "@/components/admin-users/components/AdminUsersDialogs";
import { AdminUserStatusDialogs } from "@/components/admin-users/components/dialogs/AdminUserStatusDialogs";

const Users = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStatusWarningOpen, setIsStatusWarningOpen] = useState(false);
  const [isActivateWarningOpen, setIsActivateWarningOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminUser | null>(null);

  const {
    users,
    pagination,
    roles,
    searchTerm,
    addUser,
    updateUser,
    resetPassword,
    goToPage,
    changePageSize,
    handleSearch,
  } = useAdminUsersData();

  const [newItem, setNewItem] = useState<UserFormItem>({
    name: "",
    email: "",
    phoneNumber: "",
    roleId: 2,
    isActive: true,
  });

  const proceedWithUpdate = async (user: AdminUser, data: UserFormItem) => {
    try {
      await updateUser(user, data);
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      });
      return false;
    }
  };

  const statusActions = useAdminUserStatusActions({
    proceedWithUpdate,
    setIsStatusWarningOpen,
    setIsActivateWarningOpen,
  });

  const resetForm = () => {
    setNewItem({
      name: "",
      email: "",
      phoneNumber: "",
      roleId: 2,
      isActive: true,
    });
  };

  const handleAddDialogOpen = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addUser(newItem);
      toast({
        title: "User Added!",
        description: "Successfully added to the system.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = (item: AdminUser) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      email: item.email,
      phoneNumber: item.phoneNumber || "",
      roleId: item.roleId || 2,
      isActive: item.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    const success = statusActions.handleUpdateItem(e, editingItem, newItem);
    if (success) {
      toast({
        title: "User Updated!",
        description: "Successfully updated in the system.",
      });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      resetForm();
    }
  };

  const handleResetPassword = async (item: AdminUser) => {
    try {
      await resetPassword(item);
      toast({
        title: "Password Reset",
        description:
          "Password reset successfully. New password sent via email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
      });
    }
  };

  const handleConfirmStatusChange = () => {
    statusActions.handleConfirmStatusChange();
    setIsEditDialogOpen(false);
    setEditingItem(null);
    resetForm();
  };

  const handleConfirmActivateChange = () => {
    statusActions.handleConfirmActivateChange();
    setIsEditDialogOpen(false);
    setEditingItem(null);
    resetForm();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <AdminUsersPageHeader
          onAddUser={handleAddDialogOpen}
          totalCount={pagination.totalItems}
        />

        {/* Users Table */}
        <AdminUsersTableSection
          users={users}
          pagination={pagination}
          searchTerm={searchTerm}
          onEditUser={handleEditItem}
          onResetPassword={handleResetPassword}
          onPageChange={goToPage}
          onPageSizeChange={changePageSize}
          onSearch={handleSearch}
        />

        {/* All Dialogs */}
        <AdminUsersDialogs
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          newItem={newItem}
          setNewItem={setNewItem}
          editingItem={editingItem}
          onAddUser={handleAddItem}
          onUpdateUser={handleUpdateItem}
          roles={roles}
        />

        {/* Status Change Warning Dialogs */}
        <AdminUserStatusDialogs
          isStatusWarningOpen={isStatusWarningOpen}
          isActivateWarningOpen={isActivateWarningOpen}
          userName={editingItem?.name || ""}
          onConfirmStatusChange={handleConfirmStatusChange}
          onConfirmActivateChange={handleConfirmActivateChange}
          onCancelStatusChange={statusActions.handleCancelStatusChange}
          onCancelActivateChange={statusActions.handleCancelActivateChange}
        />
      </div>
    </Layout>
  );
};

export default Users;
