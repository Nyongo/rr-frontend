import { useState } from "react";
import Layout from "@/components/Layout";
import { toast } from "@/hooks/use-toast";
import { Customer, CustomerFormItem } from "@/components/customers/types";
import { useCustomersData } from "@/components/customers/hooks/useCustomersData";
import { useCustomerStatusActions } from "@/components/customers/hooks/useCustomerStatusActions";
import { CustomersPageHeader } from "@/components/customers/components/CustomersPageHeader";
import { CustomersTableSection } from "@/components/customers/components/CustomersTableSection";
import { CustomersDialogs } from "@/components/customers/components/CustomersDialogs";
import { CustomerStatusDialogs } from "@/components/customers/components/dialogs/CustomerStatusDialogs";

const Customers = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isDeactivationDialogOpen, setIsDeactivationDialogOpen] =
    useState(false);
  const [isActivationDialogOpen, setIsActivationDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Customer | null>(null);
  const [customerToDeactivate, setCustomerToDeactivate] =
    useState<Customer | null>(null);
  const [customerToActivate, setCustomerToActivate] = useState<Customer | null>(
    null
  );

  const {
    customers,
    loading,
    pagination,
    searchTerm,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    resetPassword,
    goToPage,
    changePageSize,
    handleSearch,
  } = useCustomersData();

  const [newItem, setNewItem] = useState<CustomerFormItem>({
    companyName: "",
    contactPerson: "",
    phoneNumber: "",
    emailAddress: "",
    numberOfSchools: 1,
    isActive: true,
    companyLogo: null,
  });

  const resetForm = () => {
    setNewItem({
      companyName: "",
      contactPerson: "",
      phoneNumber: "",
      emailAddress: "",
      numberOfSchools: 1,
      isActive: true,
      companyLogo: null,
    });
  };

  const handleAddDialogOpen = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(newItem);
    toast({
      title: "Customer Added!",
      description: "Successfully added to the system.",
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditItem = (item: Customer) => {
    setEditingItem(item);
    setNewItem({
      companyName: item.companyName,
      contactPerson: item.contactPerson,
      phoneNumber: item.phoneNumber,
      emailAddress: item.emailAddress,
      numberOfSchools: item.numberOfSchools,
      isActive: item.isActive,
      companyLogo: null,
    });
    setIsEditDialogOpen(true);
  };

  const proceedWithUpdate = (customer: Customer, data: CustomerFormItem) => {
    updateCustomer(customer, data);
    toast({
      title: "Customer Updated!",
      description: "Successfully updated in the system.",
    });
    setIsEditDialogOpen(false);
    setEditingItem(null);
    resetForm();
    return true;
  };

  const statusActions = useCustomerStatusActions({
    proceedWithUpdate,
    setIsDeactivationDialogOpen,
    setIsActivationDialogOpen,
  });

  const handleUpdateItem = (e: React.FormEvent) => {
    statusActions.handleUpdateItem(e, editingItem, newItem);
  };

  const handleDeleteItem = (item: Customer) => {
    deleteCustomer(item);
    toast({
      title: "Customer Deleted",
      description: "Customer has been removed from the system.",
    });
  };

  const handleImport = () => {
    toast({
      title: "Import Started!",
      description: "Customer data import is being processed.",
    });
    setIsImportDialogOpen(false);
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
        <CustomersPageHeader
          onAddCustomer={handleAddDialogOpen}
          onImportCustomers={() => setIsImportDialogOpen(true)}
          totalCount={pagination.totalItems}
        />

        {/* Customers Table */}
        <CustomersTableSection
          customers={customers}
          pagination={pagination}
          searchTerm={searchTerm}
          onEditCustomer={handleEditItem}
          onResetPassword={async (customer) => {
            try {
              await resetPassword(customer, "new-token");
              toast({
                title: "Password Reset",
                description:
                  "Password reset successfully. New password sent via email.",
              });
            } catch (error) {
              toast({
                title: "Error",
                description:
                  error instanceof Error
                    ? error.message
                    : "Failed to reset password",
                variant: "destructive",
              });
            }
          }}
          onSearch={handleSearch}
          onPageChange={goToPage}
          onPageSizeChange={changePageSize}
        />

        {/* All Dialogs */}
        <CustomersDialogs
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          isImportDialogOpen={isImportDialogOpen}
          setIsImportDialogOpen={setIsImportDialogOpen}
          newItem={newItem}
          setNewItem={setNewItem}
          editingItem={editingItem}
          onAddCustomer={handleAddItem}
          onUpdateCustomer={handleUpdateItem}
          onImport={handleImport}
        />

        {/* Status Change Dialogs */}
        <CustomerStatusDialogs
          isDeactivationDialogOpen={isDeactivationDialogOpen}
          isActivationDialogOpen={isActivationDialogOpen}
          customerName={
            editingItem?.companyName ||
            customerToDeactivate?.companyName ||
            customerToActivate?.companyName ||
            ""
          }
          onConfirmDeactivation={handleDeactivationConfirm}
          onConfirmActivation={handleActivationConfirm}
          onCancelDeactivation={statusActions.handleCancelStatusChange}
          onCancelActivation={statusActions.handleCancelActivateChange}
        />
      </div>
    </Layout>
  );
};

export default Customers;
