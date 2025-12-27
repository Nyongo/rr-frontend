import { useState, useEffect } from "react";
import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  Driver,
  CreateDriverRequest,
} from "@/services/driversApi";
import { toast } from "@/hooks/use-toast";

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async (
    page: number = 1,
    pageSize: number = 100,
    search?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDrivers(page, pageSize, search);
      setDrivers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch drivers");
      console.error("Failed to fetch drivers:", err);
      toast({
        title: "Error",
        description: "Failed to load drivers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addDriver = async (driverData: CreateDriverRequest) => {
    try {
      const response = await createDriver(driverData);
      setDrivers([...drivers, response.data]);
      toast({
        title: "Driver Added!",
        description: `Driver ${driverData.name} has been successfully added.`,
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add driver";
      console.error("Failed to add driver:", err);
      toast({
        title: "Error",
        description: `Failed to add driver: ${errorMessage}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateDriverData = async (
    driverId: string,
    driverData: CreateDriverRequest
  ) => {
    try {
      const response = await updateDriver(driverId, driverData);
      setDrivers(
        drivers.map((driver) =>
          driver.id === driverId ? response.data : driver
        )
      );
      toast({
        title: "Driver Updated!",
        description: `Driver ${driverData.name} has been successfully updated.`,
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update driver";
      console.error("Failed to update driver:", err);
      toast({
        title: "Error",
        description: `Failed to update driver: ${errorMessage}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  const removeDriver = async (driverId: string) => {
    try {
      await deleteDriver(driverId);
      const driverToDelete = drivers.find((driver) => driver.id === driverId);
      setDrivers(drivers.filter((driver) => driver.id !== driverId));
      toast({
        title: "Driver Deleted!",
        description: `Driver ${driverToDelete?.name} has been removed from the system.`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete driver";
      console.error("Failed to delete driver:", err);
      toast({
        title: "Error",
        description: `Failed to delete driver: ${errorMessage}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return {
    drivers,
    loading,
    error,
    fetchDrivers,
    addDriver,
    updateDriver: updateDriverData,
    deleteDriver: removeDriver,
    refetch: () => fetchDrivers(),
  };
};

