import { useState } from "react";
import Layout from "@/components/Layout";
import { toast } from "@/hooks/use-toast";
import { Subscription, SubscriptionFormItem } from "@/components/subscriptions/types";
import { useSubscriptionsData } from "@/components/subscriptions/hooks/useSubscriptionsData";
import { useSubscriptionStatusActions } from "@/components/subscriptions/hooks/useSubscriptionStatusActions";
import { SubscriptionsPageHeader } from "@/components/subscriptions/components/SubscriptionsPageHeader";
import { SubscriptionsTableSection } from "@/components/subscriptions/components/SubscriptionsTableSection";
import { SubscriptionsDialogs } from "@/components/subscriptions/components/SubscriptionsDialogs";
import { SubscriptionStatusDialogs } from "@/components/subscriptions/components/dialogs/SubscriptionStatusDialogs";

const Subscriptions = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [isDeactivationDialogOpen, setIsDeactivationDialogOpen] = useState(false);
  const [isActivationDialogOpen, setIsActivationDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Subscription | null>(null);
  const [subscriptionToDeactivate, setSubscriptionToDeactivate] = useState<Subscription | null>(null);
  const [subscriptionToActivate, setSubscriptionToActivate] = useState<Subscription | null>(null);

  const {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getCustomerOptions
  } = useSubscriptionsData();

  const [newItem, setNewItem] = useState<SubscriptionFormItem>({
    customerId: "",
    fromStudents: 1,
    toStudents: 100,
    pricePerTerm: 0,
    status: "active"
  });

  const resetForm = () => {
    setNewItem({
      customerId: "",
      fromStudents: 1,
      toStudents: 100,
      pricePerTerm: 0,
      status: "active"
    });
  };

  const handleAddDialogOpen = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addSubscription(newItem);
      toast({
        title: "Subscription Added!",
        description: "Successfully added to the system."
      });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error!",
        description: error instanceof Error ? error.message : "Failed to add subscription",
        variant: "destructive"
      });
    }
  };

  const handleEditItem = (item: Subscription) => {
    setEditingItem(item);
    setNewItem({
      customerId: item.customerId,
      fromStudents: item.fromStudents,
      toStudents: item.toStudents,
      pricePerTerm: item.pricePerTerm,
      status: item.status
    });
    setIsEditDialogOpen(true);
  };

  const proceedWithUpdate = (subscription: Subscription, data: SubscriptionFormItem) => {
    try {
      updateSubscription(subscription, data);
      toast({
        title: "Subscription Updated!",
        description: "Successfully updated in the system."
      });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      resetForm();
      return true;
    } catch (error) {
      toast({
        title: "Error!",
        description: error instanceof Error ? error.message : "Failed to update subscription",
        variant: "destructive"
      });
      return false;
    }
  };

  const statusActions = useSubscriptionStatusActions({
    proceedWithUpdate,
    setIsDeactivationDialogOpen,
    setIsActivationDialogOpen,
  });

  const handleUpdateItem = (e: React.FormEvent) => {
    try {
      statusActions.handleUpdateItem(e, editingItem, newItem);
    } catch (error) {
      toast({
        title: "Error!",
        description: error instanceof Error ? error.message : "Failed to update subscription",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = (item: Subscription) => {
    deleteSubscription(item);
    toast({
      title: "Subscription Deleted",
      description: "Subscription has been removed from the system."
    });
  };


  
  const handleDeactivationConfirm = () => {
    statusActions.handleConfirmStatusChange();
    setIsEditDialogOpen(false);
    setEditingItem(null);
    resetForm();
  };
  
  const handleActivationConfirm = () => {
    statusActions.handleConfirmActivateChange();
    setIsEditDialogOpen(false);
    setEditingItem(null);
    resetForm();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <SubscriptionsPageHeader 
          onAddSubscription={handleAddDialogOpen}
        />

        {/* Subscriptions Table */}
        <SubscriptionsTableSection
          subscriptions={subscriptions}
          onEditSubscription={handleEditItem}
          onDeleteSubscription={handleDeleteItem}
        />

        {/* All Dialogs */}
        <SubscriptionsDialogs
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          newItem={newItem}
          setNewItem={setNewItem}
          editingItem={editingItem}
          customerOptions={getCustomerOptions()}
          onAddSubscription={handleAddItem}
          onUpdateSubscription={handleUpdateItem}
        />
        
        {/* Status Change Dialogs */}
        <SubscriptionStatusDialogs
          isDeactivationDialogOpen={isDeactivationDialogOpen}
          isActivationDialogOpen={isActivationDialogOpen}
          customerName={editingItem?.customerName || subscriptionToDeactivate?.customerName || subscriptionToActivate?.customerName || ""}
          onConfirmDeactivation={handleDeactivationConfirm}
          onConfirmActivation={handleActivationConfirm}
          onCancelDeactivation={statusActions.handleCancelStatusChange}
          onCancelActivation={statusActions.handleCancelActivateChange}
        />
      </div>
    </Layout>
  );
};

export default Subscriptions;