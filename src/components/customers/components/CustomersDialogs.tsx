import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Customer, CustomerFormItem } from "../types";
import { CustomerForm } from "../forms/CustomerForm";

interface CustomersDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isImportDialogOpen: boolean;
  setIsImportDialogOpen: (open: boolean) => void;
  newItem: CustomerFormItem;
  setNewItem: (item: CustomerFormItem) => void;
  editingItem: Customer | null;
  onAddCustomer: (e: React.FormEvent) => void;
  onUpdateCustomer: (e: React.FormEvent) => void;
  onImport: () => void;
}

export const CustomersDialogs = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isImportDialogOpen,
  setIsImportDialogOpen,
  newItem,
  setNewItem,
  editingItem,
  onAddCustomer,
  onUpdateCustomer,
  onImport,
}: CustomersDialogsProps) => {
  const handleDownloadTemplate = () => {
    // In a real implementation, this would generate a CSV template
    const content = "Company Name,Contact Person,Phone,Email,Status\nExample Company,John Doe,(555) 123-4567,john@example.com,active";
    const filename = 'customer_template.csv';
    
    // Create a download link
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Template Downloaded!",
      description: "Customer CSV template has been downloaded."
    });
  };

  return (
    <>
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onAddCustomer} className="space-y-4">
            <CustomerForm newItem={newItem} setNewItem={setNewItem} />
            <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
              Add Customer
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the customer account information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onUpdateCustomer} className="space-y-4">
            <CustomerForm newItem={newItem} setNewItem={setNewItem} isEditing={true} />
            <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
              Update Customer
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Customer Data</DialogTitle>
            <DialogDescription>
              Upload a CSV file containing customer information.
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
              <p>CSV should include: Company Name, Contact Person, Phone, Email, Status</p>
            </div>
            <Button onClick={onImport} className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
              Import Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};