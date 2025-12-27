
import { useState } from "react";
import Layout from "@/components/Layout";
import { toast } from "@/hooks/use-toast";
import { User, UserFormItem } from "@/components/users/types";
import { useUsersData } from "@/components/users/hooks/useUsersData";
import { useUserStatusActions } from "@/components/users/hooks/useUserStatusActions";
import { UsersPageHeader } from "@/components/users/components/UsersPageHeader";
import { UsersTableSection } from "@/components/users/components/UsersTableSection";
import { UsersDialogs } from "@/components/users/components/UsersDialogs";
import { UserStatusDialogs } from "@/components/users/components/UserStatusDialogs";

const Users = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isStatusWarningOpen, setIsStatusWarningOpen] = useState(false);
  const [isActivateWarningOpen, setIsActivateWarningOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | null>(null);

  const {
    users,
    addUser,
    updateUser,
    deleteUser
  } = useUsersData();

  const [newItem, setNewItem] = useState<UserFormItem>({
    fullName: "",
    email: "",
    phone: "",
    schoolName: "",
    role: "User",
    status: "Active"
  });

  const proceedWithUpdate = (user: User, data: UserFormItem) => {
    updateUser(user, data);
    return true;
  };

  const statusActions = useUserStatusActions({
    proceedWithUpdate,
    setIsStatusWarningOpen,
    setIsActivateWarningOpen,
  });

  const resetForm = () => {
    setNewItem({
      fullName: "",
      email: "",
      phone: "",
      schoolName: "",
      role: "User",
      status: "Active"
    });
  };

  const handleAddDialogOpen = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(newItem);
    toast({
      title: "User Added!",
      description: "Successfully added to the system."
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditItem = (item: User) => {
    setEditingItem(item);
    setNewItem({
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      schoolName: item.schoolName,
      role: item.role,
      status: item.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    const success = statusActions.handleUpdateItem(e, editingItem, newItem);
    if (success) {
      toast({
        title: "User Updated!",
        description: "Successfully updated in the system."
      });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      resetForm();
    }
  };

  const handleDeleteItem = (item: User) => {
    deleteUser(item);
  };

  const handleImport = () => {
    toast({
      title: "Import Started!",
      description: "User data import is being processed."
    });
    setIsImportDialogOpen(false);
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
        <UsersPageHeader 
          onAddUser={handleAddDialogOpen}
          onImportUsers={() => setIsImportDialogOpen(true)}
        />

        {/* Users Table */}
        <UsersTableSection
          users={users}
          onEditUser={handleEditItem}
          onDeleteUser={handleDeleteItem}
        />

        {/* All Dialogs */}
        <UsersDialogs
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          isImportDialogOpen={isImportDialogOpen}
          setIsImportDialogOpen={setIsImportDialogOpen}
          newItem={newItem}
          setNewItem={setNewItem}
          editingItem={editingItem}
          onAddUser={handleAddItem}
          onUpdateUser={handleUpdateItem}
          onImport={handleImport}
        />

        {/* Status Change Warning Dialogs */}
        <UserStatusDialogs
          isStatusWarningOpen={isStatusWarningOpen}
          isActivateWarningOpen={isActivateWarningOpen}
          userName={editingItem?.fullName || ""}
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
