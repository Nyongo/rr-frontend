
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BusForm } from "@/components/fleet/forms/BusForm";
import { PersonForm } from "@/components/fleet/forms/PersonForm";
import { Bus, Driver, Minder } from "@/components/fleet/types";

interface FleetDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isImportDialogOpen: boolean;
  setIsImportDialogOpen: (open: boolean) => void;
  newItem: any;
  setNewItem: (item: any) => void;
  editingItem: Bus | Driver | Minder | null;
  activeTab: string;
  onAddItem: (e: React.FormEvent) => void;
  onUpdateItem: (e: React.FormEvent) => void;
  onImport: () => void;
}

export const FleetDialogs = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isImportDialogOpen,
  setIsImportDialogOpen,
  newItem,
  setNewItem,
  editingItem,
  activeTab,
  onAddItem,
  onUpdateItem,
  onImport,
}: FleetDialogsProps) => {
  const getDialogTitle = (isEdit: boolean) => {
    const action = isEdit ? "Edit" : "Add";
    switch(activeTab) {
      case "buses": return `${action} Bus`;
      case "drivers": return `${action} Driver`;
      case "minders": return `${action} Minder`;
      default: return `${action} Item`;
    }
  };

  const renderForm = () => {
    if (activeTab === "buses") {
      return (
        <BusForm 
          newItem={newItem} 
          setNewItem={setNewItem}
        />
      );
    } else {
      const personType = activeTab === "drivers" ? "driver" : "minder";
      return (
        <PersonForm 
          newItem={newItem} 
          setNewItem={setNewItem} 
          type={personType}
        />
      );
    }
  };

  return (
    <>
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getDialogTitle(false)}</DialogTitle>
            <DialogDescription>
              Add a new {activeTab.slice(0, -1)} to the system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onAddItem} className="space-y-4">
            {renderForm()}
            <DialogFooter>
              <Button type="submit" className="w-full">
                Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getDialogTitle(true)}</DialogTitle>
            <DialogDescription>
              Update the {activeTab.slice(0, -1)} information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onUpdateItem} className="space-y-4">
            {renderForm()}
            <DialogFooter>
              <Button type="submit" className="w-full">
                Update {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Data</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import multiple {activeTab}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-600">Drag and drop your CSV file here, or click to browse</p>
              <Button variant="outline" className="mt-2">Choose File</Button>
            </div>
            <DialogFooter>
              <Button onClick={onImport} className="w-full">
                Import Data
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
