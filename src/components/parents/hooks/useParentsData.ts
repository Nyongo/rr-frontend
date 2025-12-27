import { useParents } from "@/hooks/useParents";
import { Parent, ParentFormItem } from "../types";
import {
  CreateParentRequest,
  UpdateParentRequest,
} from "@/services/parentsApi";

export const useParentsData = () => {
  const { parents, loading, addParent, updateParent, deleteParent, refetch } =
    useParents();

  const addParentData = async (newParentData: ParentFormItem) => {
    // Convert form data to API format
    const apiData: CreateParentRequest = {
      name: newParentData.name,
      parentType: newParentData.parentType,
      phoneNumber: newParentData.phoneNumber || newParentData.phone || "",
      email: newParentData.email,
      schoolId:
        newParentData.schoolId || "567431ac-cab3-41e5-b0ca-ee4de0953661", // Default school ID
      status: newParentData.status || "Active",
      isActive: newParentData.status === "Active" ? true : false,
    };

    const result = await addParent(apiData);
    // Refetch parents to ensure data is in sync with server
    await refetch();
    return result;
  };

  const updateParentData = async (
    parentToUpdate: Parent,
    updatedData: ParentFormItem
  ) => {
    // Convert form data to API format
    const apiData: UpdateParentRequest = {
      name: updatedData.name,
      parentType: updatedData.parentType,
      phoneNumber: updatedData.phoneNumber || updatedData.phone || "",
      email: updatedData.email,
      schoolId: updatedData.schoolId || parentToUpdate.schoolId,
      status: updatedData.status || "Active",
      isActive: updatedData.status === "Active" ? true : false,
    };

    const result = await updateParent(parentToUpdate.id, apiData);
    // Refetch parents to ensure data is in sync
    await refetch();
    return result;
  };

  const deleteParentData = async (parentToDelete: Parent) => {
    const result = await deleteParent(parentToDelete.id);
    // Refetch parents to ensure data is in sync
    await refetch();
    return result;
  };

  return {
    parents,
    loading,
    addParent: addParentData,
    updateParent: updateParentData,
    deleteParent: deleteParentData,
    refetch,
  };
};
