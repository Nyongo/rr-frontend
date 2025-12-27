import { useState, useCallback } from "react";
import {
  getAddressesByParentId,
  createAddress,
  updateAddress,
  deleteAddress,
  toggleAddressStatus,
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "@/services/addressesApi";
import { toast } from "@/hooks/use-toast";

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddressesByParent = useCallback(
    async (parentId: string, page: number = 1, pageSize: number = 100) => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAddressesByParentId(parentId, page, pageSize);
        setAddresses(response.data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch addresses";
        setError(message);
        toast({ title: "Error", description: message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const addAddress = async (data: CreateAddressRequest) => {
    try {
      const response = await createAddress(data);
      setAddresses((prev) => [...prev, response.data]);
      toast({
        title: "Address Added!",
        description: `Address has been added successfully.`,
      });
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add address";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  const updateAddressData = async (
    addressId: string,
    data: UpdateAddressRequest
  ) => {
    try {
      const response = await updateAddress(addressId, data);
      setAddresses((prev) =>
        prev.map((a) => (a.id === addressId ? response.data : a))
      );
      toast({
        title: "Address Updated!",
        description: `Address has been updated successfully.`,
      });
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update address";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  const removeAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId);
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      toast({
        title: "Address Deleted!",
        description: `The address has been removed.`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete address";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  const toggleStatus = async (addressId: string, status: string) => {
    try {
      const response = await toggleAddressStatus(addressId, status);
      setAddresses((prev) =>
        prev.map((a) => (a.id === addressId ? response.data : a))
      );
      toast({
        title: "Address Status Updated!",
        description: `Address status has been changed to ${status}.`,
      });
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update address status";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  return {
    addresses,
    loading,
    error,
    fetchAddressesByParent,
    addAddress,
    updateAddress: updateAddressData,
    deleteAddress: removeAddress,
    toggleAddressStatus: toggleStatus,
  };
};
