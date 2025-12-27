import { useEffect, useState, useCallback } from "react";
import {
  getParents,
  getParentById,
  createParent,
  updateParent,
  deleteParent,
  toggleParentStatus,
  Parent,
  CreateParentRequest,
  UpdateParentRequest,
} from "@/services/parentsApi";
import { toast } from "@/hooks/use-toast";

export const useParents = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParents = async (
    page: number = 1,
    pageSize: number = 100,
    search?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getParents(page, pageSize, search);
      setParents(response.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch parents";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addParent = async (data: CreateParentRequest) => {
    try {
      const response = await createParent(data);
      // Don't update local state here - let refetch() handle it to ensure we get fresh data
      toast({
        title: "Parent Added!",
        description: `${data.name} has been added.`,
      });
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add parent";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  const updateParentData = async (
    parentId: string,
    data: UpdateParentRequest
  ) => {
    try {
      const response = await updateParent(parentId, data);
      setParents((prev) =>
        prev.map((p) => (p.id === parentId ? response.data : p))
      );
      toast({
        title: "Parent Updated!",
        description: `${data.name || "Parent"} has been updated.`,
      });
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update parent";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  const removeParent = async (parentId: string) => {
    try {
      await deleteParent(parentId);
      setParents((prev) => prev.filter((p) => p.id !== parentId));
      toast({
        title: "Parent Deleted!",
        description: `The parent has been removed.`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete parent";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  const toggleStatus = async (parentId: string, isActive: boolean) => {
    try {
      const response = await toggleParentStatus(parentId, isActive);
      setParents((prev) =>
        prev.map((p) => (p.id === parentId ? response.data : p))
      );
      toast({
        title: "Parent Status Updated!",
        description: `Parent has been ${
          isActive ? "activated" : "deactivated"
        }.`,
      });
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update parent status";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  const fetchSingleParent = useCallback(async (parentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getParentById(parentId);
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch parent";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParents();
  }, []);

  return {
    parents,
    loading,
    error,
    fetchParents,
    fetchSingleParent,
    addParent,
    updateParent: updateParentData,
    deleteParent: removeParent,
    toggleParentStatus: toggleStatus,
    refetch: () => fetchParents(),
  };
};
