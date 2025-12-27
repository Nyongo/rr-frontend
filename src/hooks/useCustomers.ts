import { useState, useEffect } from "react";
import { getCustomers, CreateCustomerResponse } from "@/services/customerApi";

export interface Customer {
  id: number;
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  emailAddress: string;
  numberOfSchools: number;
  isActive: boolean;
  companyLogo?: string;
  createdAt: string;
  updatedAt: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCustomers(1, 100); // Get first 100 customers
      setCustomers(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch customers"
      );
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
  };
};

