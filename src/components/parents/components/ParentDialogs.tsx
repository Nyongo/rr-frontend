
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Upload, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Parent, ParentFormItem } from "../types";
import { ParentForm } from "../forms/ParentForm";
import { generateParentCSVTemplate, downloadCSV } from "@/components/utils/csvTemplates";

interface ParentDialogsProps {
  // Add dialog states
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isImportDialogOpen: boolean;
  setIsImportDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  
  // Form data
  newItem: ParentFormItem;
  setNewItem: (item: ParentFormItem) => void;
  editingItem: Parent | null;
  itemToDelete: Parent | null;
  
  // Actions
  onAddParent: (e: React.FormEvent) => void;
  onUpdateParent: (e: React.FormEvent) => void;
  onConfirmDelete: () => void;
  onImport: () => void;
}

export const ParentDialogs = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isImportDialogOpen,
  setIsImportDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  newItem,
  setNewItem,
  editingItem,
  itemToDelete,
  onAddParent,
  onUpdateParent,
  onConfirmDelete,
  onImport,
}: ParentDialogsProps) => {
  const handleDownloadTemplate = () => {
    const content = generateParentCSVTemplate();
    const filename = 'parent_template.csv';
    
    downloadCSV(content, filename);
    toast({
      title: "Template Downloaded!",
      description: "Parent CSV template has been downloaded.",
    });
  };

  return (
    <>
      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Parent Data</DialogTitle>
            <DialogDescription>
              Upload a CSV file containing parent information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Need a template?</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
              >
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
              <p>CSV should include: Name, Email, Phone, Status</p>
            </div>
            <Button onClick={onImport} className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
              Import Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Parent</DialogTitle>
            <DialogDescription>
              Manually add a new parent to the system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onAddParent} className="space-y-4">
            <ParentForm newItem={newItem} setNewItem={setNewItem} />
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
              Add Parent
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Parent</DialogTitle>
            <DialogDescription>
              Update the parent account information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onUpdateParent} className="space-y-4">
            <ParentForm newItem={newItem} setNewItem={setNewItem} isEditing={true} />
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
              Update Parent
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the parent account for{" "}
              <span className="font-semibold">{itemToDelete?.name}</span> and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
