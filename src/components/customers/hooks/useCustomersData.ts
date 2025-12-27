import { useState, useEffect } from "react";
import { Customer, CustomerFormItem } from "../types";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  Pagination,
} from "@/services/customerApi";
import { resetUserPassword } from "@/services/usersApi";

// Mock data
const mockCustomers: Customer[] = [
  {
    id: 1,
    companyLogo: "/logos/customer1.png",
    companyName: "Alliance High School Group",
    contactPerson: "James Mwangi",
    phoneNumber: "+254 722 123 456",
    emailAddress: "james.mwangi@alliancehigh.ac.ke",
    numberOfSchools: 3,
    isActive: true,
    userId: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    companyName: "Brookhouse Schools Kenya",
    contactPerson: "Sarah Njeri",
    phoneNumber: "+254 733 987 654",
    emailAddress: "sarah.njeri@brookhouse.ac.ke",
    numberOfSchools: 2,
    isActive: true,
    userId: 2,
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: 3,
    companyLogo: "/logos/customer3.png",
    companyName: "Starehe Boys Centre",
    contactPerson: "John Odhiambo",
    phoneNumber: "+254 722 345 678",
    emailAddress: "john.odhiambo@starehe.ac.ke",
    numberOfSchools: 1,
    isActive: true,
    userId: 3,
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-03T00:00:00.000Z",
  },
  {
    id: 4,
    companyName: "Kenya High School",
    contactPerson: "Mary Wambui",
    phoneNumber: "+254 733 456 789",
    emailAddress: "mary.wambui@kenyahigh.ac.ke",
    numberOfSchools: 1,
    isActive: true,
    userId: 4,
    createdAt: "2024-01-04T00:00:00.000Z",
    updatedAt: "2024-01-04T00:00:00.000Z",
  },
  {
    id: 5,
    companyLogo: "/logos/customer5.png",
    companyName: "Mang'u High School",
    contactPerson: "Peter Kamau",
    phoneNumber: "+254 722 567 890",
    emailAddress: "peter.kamau@mangu.ac.ke",
    numberOfSchools: 1,
    isActive: true,
    userId: 5,
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-05T00:00:00.000Z",
  },
];

export const useCustomersData = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Load initial data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await getCustomers(
          pagination.page,
          pagination.pageSize,
          searchTerm
        );
        if (response.success) {
          setCustomers(response.data);
          setTotalCount(response.count);
          setPagination(response.pagination);
        } else {
          throw new Error("Failed to fetch customers");
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        // Fallback to mock data on error
        setCustomers(mockCustomers);
        setTotalCount(mockCustomers.length);
        setPagination({
          page: 1,
          pageSize: 10,
          totalItems: mockCustomers.length,
          totalPages: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [pagination.page, pagination.pageSize, searchTerm]);

  // Add customer
  const addCustomer = async (customerData: CustomerFormItem) => {
    try {
      const apiData = {
        companyName: customerData.companyName,
        contactPerson: customerData.contactPerson,
        phoneNumber: customerData.phoneNumber,
        emailAddress: customerData.emailAddress,
        numberOfSchools: customerData.numberOfSchools,
        isActive: customerData.isActive,
        companyLogo: customerData.companyLogo,
      };

      const response = await createCustomer(apiData);

      if (response.success) {
        setCustomers((prev) => [...prev, response.data]);
        setTotalCount((prev) => prev + 1);
        return response.data;
      } else {
        throw new Error(response.message || "Failed to create customer");
      }
    } catch (error) {
      console.error("Failed to create customer:", error);
      throw error;
    }
  };

  // Update customer
  const updateCustomerData = async (
    customer: Customer,
    data: CustomerFormItem
  ) => {
    try {
      const apiData = {
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        phoneNumber: data.phoneNumber,
        emailAddress: data.emailAddress,
        numberOfSchools: data.numberOfSchools,
        isActive: data.isActive,
        companyLogo: data.companyLogo,
      };

      const response = await updateCustomer(customer.id, apiData);

      if (response.success) {
        setCustomers((prev) =>
          prev.map((c) => {
            if (c.id === customer.id) {
              return response.data;
            }
            return c;
          })
        );
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update customer");
      }
    } catch (error) {
      console.error("Failed to update customer:", error);
      throw error;
    }
  };

  // Delete customer
  const deleteCustomer = (customer: Customer) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    setTotalCount((prev) => Math.max(0, prev - 1));
  };

  // Reset customer password
  const resetPassword = async (customer: Customer, token: string) => {
    try {
      await resetUserPassword(customer.userId, token);
      return true;
    } catch (error) {
      console.error("Failed to reset customer password:", error);
      throw error;
    }
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const changePageSize = (pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  // Search handler
  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when searching
  };

  return {
    customers,
    loading,
    totalCount,
    pagination,
    searchTerm,
    addCustomer,
    updateCustomer: updateCustomerData,
    deleteCustomer,
    resetPassword,
    goToPage,
    changePageSize,
    handleSearch,
  };
};
