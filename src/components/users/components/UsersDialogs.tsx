
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { User, UserFormItem } from "../types";
import { UserForm } from "../forms/UserForm";
import { generateUserCSVTemplate, downloadCSV } from "@/components/utils/csvTemplates";

interface UsersDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isImportDialogOpen: boolean;
  setIsImportDialogOpen: (open: boolean) => void;
  newItem: UserFormItem;
  setNewItem: (item: UserFormItem) => void;
  editingItem: User | null;
  onAddUser: (e: React.FormEvent) => void;
  onUpdateUser: (e: React.FormEvent) => void;
  onImport: () => void;
}

export const UsersDialogs = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isImportDialogOpen,
  setIsImportDialogOpen,
  newItem,
  setNewItem,
  editingItem,
  onAddUser,
  onUpdateUser,
  onImport,
}: UsersDialogsProps) => {
  const handleDownloadTemplate = () => {
    const content = generateUserCSVTemplate();
    const filename = 'user_template.csv';
    downloadCSV(content, filename);
    toast({
      title: "Template Downloaded!",
      description: "User CSV template has been downloaded."
    });
  };

  return (
    <>
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Add a new school user account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onAddUser} className="space-y-4">
            <UserForm newItem={newItem} setNewItem={setNewItem} />
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
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
            <UserForm newItem={newItem} setNewItem={setNewItem} isEditing={true} />
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
              Update User
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import User Data</DialogTitle>
            <DialogDescription>
              Upload a CSV file containing user information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Need a template?</span>
              <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Template
              </Button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drop your CSV file here or click to browse</p>
              <Button variant="outline">Choose File</Button>
            </div>
            <div className="text-xs text-gray-500">
              <p>CSV should include: Full Name, Email, Phone, School Name, Status</p>
            </div>
            <Button onClick={onImport} className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
              Import Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
