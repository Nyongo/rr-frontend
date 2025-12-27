import { useState, useEffect } from "react";
import {
  getBuses,
  createBus,
  updateBus,
  deleteBus,
  Bus,
  CreateBusRequest,
} from "@/services/busesApi";
import { toast } from "@/hooks/use-toast";

export const useBuses = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuses = async (
    page: number = 1,
    pageSize: number = 100,
    search?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBuses(page, pageSize, search);
      setBuses(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch buses");
      console.error("Failed to fetch buses:", err);
      toast({
        title: "Error",
        description: "Failed to load buses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addBus = async (busData: CreateBusRequest) => {
    try {
      const response = await createBus(busData);
      setBuses([...buses, response.data]);
      toast({
        title: "Bus Added!",
        description: `Bus ${busData.registrationNumber} has been successfully added.`,
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add bus";
      console.error("Failed to add bus:", err);
      toast({
        title: "Error",
        description: `Failed to add bus: ${errorMessage}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateBusData = async (busId: string, busData: CreateBusRequest) => {
    try {
      const response = await updateBus(busId, busData);
      setBuses(buses.map((bus) => (bus.id === busId ? response.data : bus)));
      toast({
        title: "Bus Updated!",
        description: `Bus ${busData.registrationNumber} has been successfully updated.`,
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update bus";
      console.error("Failed to update bus:", err);
      toast({
        title: "Error",
        description: `Failed to update bus: ${errorMessage}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  const removeBus = async (busId: string) => {
    try {
      await deleteBus(busId);
      const busToDelete = buses.find((bus) => bus.id === busId);
      setBuses(buses.filter((bus) => bus.id !== busId));
      toast({
        title: "Bus Deleted!",
        description: `Bus ${busToDelete?.registrationNumber} has been removed from the system.`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete bus";
      console.error("Failed to delete bus:", err);
      toast({
        title: "Error",
        description: `Failed to delete bus: ${errorMessage}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  const toggleBusStatus = async (busId: string, isActive: boolean) => {
    try {
      const bus = buses.find((b) => b.id === busId);
      if (!bus) throw new Error("Bus not found");

      const busData: CreateBusRequest = {
        registrationNumber: bus.registrationNumber,
        schoolId: bus.schoolId,
        make: bus.make,
        model: bus.model,
        seatsCapacity: bus.seatsCapacity,
        type: bus.type,
        status: isActive ? "Active" : "Inactive",
        isActive: isActive ? "true" : "false",
      };

      const response = await updateBus(busId, busData);
      setBuses(buses.map((b) => (b.id === busId ? response.data : b)));

      toast({
        title: isActive ? "Bus Activated!" : "Bus Deactivated!",
        description: `Bus ${bus.registrationNumber} has been ${
          isActive ? "activated" : "deactivated"
        }.`,
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update bus status";
      console.error("Failed to update bus status:", err);
      toast({
        title: "Error",
        description: `Failed to update bus status: ${errorMessage}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  return {
    buses,
    loading,
    error,
    fetchBuses,
    addBus,
    updateBus: updateBusData,
    deleteBus: removeBus,
    toggleBusStatus,
    refetch: () => fetchBuses(),
  };
};
