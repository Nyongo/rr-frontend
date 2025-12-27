import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminUser, UserFormItem } from "../types";
import { AdminUserForm } from "../forms/AdminUserForm";

interface AdminUsersDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  newItem: UserFormItem;
  setNewItem: (item: UserFormItem) => void;
  editingItem: AdminUser | null;
  onAddUser: (e: React.FormEvent) => void;
  onUpdateUser: (e: React.FormEvent) => void;
  roles?: any[];
}

export const AdminUsersDialogs = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  newItem,
  setNewItem,
  editingItem,
  onAddUser,
  onUpdateUser,
  roles = [],
}: AdminUsersDialogsProps) => {
  const isFormValid = () => {
    return (
      newItem.name.trim() !== "" &&
      newItem.email.trim() !== "" &&
      newItem.roleId > 0
    );
  };

  return (
    <>
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Add a new administrator account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onAddUser} className="space-y-4">
            <AdminUserForm
              newItem={newItem}
              setNewItem={setNewItem}
              roles={roles}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700"
              disabled={!isFormValid()}
            >
              Add User
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user account information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onUpdateUser} className="space-y-4">
            <AdminUserForm
              newItem={newItem}
              setNewItem={setNewItem}
              isEditing={true}
              roles={roles}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700"
              disabled={!isFormValid()}
            >
              Update User
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
