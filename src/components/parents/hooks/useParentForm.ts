import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Parent, ParentFormItem } from "../types";
import { useParentsData } from "./useParentsData";

export const useParentForm = () => {
  const { addParent, updateParent } = useParentsData();

  const [newItem, setNewItem] = useState<ParentFormItem>({
    name: "",
    parentType: "Mother",
    phoneNumber: "",
    email: "",
    schoolId: "",
    status: "Active",
  });

  const [editingItem, setEditingItem] = useState<Parent | null>(null);

  const resetForm = () => {
    setNewItem({
      name: "",
      parentType: "Mother",
      phoneNumber: "",
      email: "",
      schoolId: "",
      status: "Active",
    });
  };

  const handleAddDialogOpen = () => {
    resetForm();
  };

  const handleAddParent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addParent(newItem);
      toast({
        title: "Parent Added!",
        description: `${newItem.name} has been successfully added.`,
      });
      resetForm();
      return true; // Indicates success for dialog closing
    } catch (error) {
      // Error handling is done in the hook
      return false;
    }
  };

  const handleEditItem = (item: Parent) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      parentType: item.parentType,
      phoneNumber: item.phoneNumber || item.phone || "",
      phone: item.phoneNumber || item.phone || "",
      email: item.email || "",
      schoolId: item.schoolId,
      status: item.status,
    });
  };

  const proceedWithUpdate = async (parent: Parent, data: ParentFormItem) => {
    try {
      await updateParent(parent, data);
      toast({
        title: "Parent Updated!",
        description: "Successfully updated in the system.",
      });
      setEditingItem(null);
      resetForm();
      return true; // Indicates success for dialog closing
    } catch (error) {
      // Error handling is done in the hook
      return false;
    }
  };

  return {
    newItem,
    setNewItem,
    editingItem,
    setEditingItem,
    resetForm,
    handleAddDialogOpen,
    handleAddParent,
    handleEditItem,
    proceedWithUpdate,
  };
};
