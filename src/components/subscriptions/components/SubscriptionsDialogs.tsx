import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Subscription, SubscriptionFormItem } from "../types";
import { SubscriptionForm } from "../forms/SubscriptionForm";

interface SubscriptionsDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  newItem: SubscriptionFormItem;
  setNewItem: (item: SubscriptionFormItem) => void;
  editingItem: Subscription | null;
  customerOptions: { value: string; label: string }[];
  onAddSubscription: (e: React.FormEvent) => void;
  onUpdateSubscription: (e: React.FormEvent) => void;
}

export const SubscriptionsDialogs = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  newItem,
  setNewItem,
  editingItem,
  customerOptions,
  onAddSubscription,
  onUpdateSubscription,
}: SubscriptionsDialogsProps) => {

  const isFormValid = () => {
    return (
      newItem.customerId &&
      newItem.fromStudents > 0 &&
      newItem.toStudents > newItem.fromStudents &&
      newItem.pricePerTerm >= 0
    );
  };

  return (
    <>
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Subscription</DialogTitle>
            <DialogDescription>
              Add a new customer subscription.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onAddSubscription} className="space-y-4">
            <SubscriptionForm 
              newItem={newItem} 
              setNewItem={setNewItem} 
              customerOptions={customerOptions}
            />
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              disabled={!isFormValid()}
            >
              Add Subscription
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Update the subscription information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onUpdateSubscription} className="space-y-4">
            <SubscriptionForm 
              newItem={newItem} 
              setNewItem={setNewItem} 
              isEditing={true} 
              customerOptions={customerOptions}
            />
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              disabled={!isFormValid()}
            >
              Update Subscription
            </Button>
          </form>
        </DialogContent>
      </Dialog>


    </>
  );
};