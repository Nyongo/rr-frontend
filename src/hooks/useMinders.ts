import { useEffect, useState } from "react";
import {
  getMinders,
  createMinder,
  updateMinder,
  deleteMinder,
  toggleMinderStatus,
  Minder,
  CreateMinderRequest,
  UpdateMinderRequest,
} from "@/services/mindersApi";
import { toast } from "@/hooks/use-toast";

export const useMinders = () => {
  const [minders, setMinders] = useState<Minder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMinders = async (
    page: number = 1,
    pageSize: number = 100,
    search?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMinders(page, pageSize, search);
      setMinders(response.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch minders";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addMinder = async (data: CreateMinderRequest) => {
    try {
      const response = await createMinder(data);
      setMinders((prev) => [...prev, response.data]);
      toast({
        title: "Minder Added!",
        description: `${data.name} has been added.`,
      });
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add minder";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  const updateMinderData = async (
    minderId: string,
    data: UpdateMinderRequest
  ) => {
    try {
      const response = await updateMinder(minderId, data);
      setMinders((prev) =>
        prev.map((m) => (m.id === minderId ? response.data : m))
      );
      toast({
        title: "Minder Updated!",
        description: `${data.name || "Minder"} has been updated.`,
      });
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update minder";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  const removeMinder = async (minderId: string) => {
    try {
      await deleteMinder(minderId);
      setMinders((prev) => prev.filter((m) => m.id !== minderId));
      toast({
        title: "Minder Deleted!",
        description: `The minder has been removed.`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete minder";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  useEffect(() => {
    fetchMinders();
  }, []);

  const toggleStatus = async (minderId: string, isActive: boolean) => {
    try {
      const response = await toggleMinderStatus(minderId, isActive);
      setMinders((prev) =>
        prev.map((m) => (m.id === minderId ? response.data : m))
      );
      toast({
        title: "Minder Status Updated!",
        description: `Minder has been ${
          isActive ? "activated" : "deactivated"
        }.`,
      });
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update minder status";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  return {
    minders,
    loading,
    error,
    fetchMinders,
    addMinder,
    updateMinder: updateMinderData,
    deleteMinder: removeMinder,
    toggleMinderStatus: toggleStatus,
    refetch: () => fetchMinders(),
  };
};
