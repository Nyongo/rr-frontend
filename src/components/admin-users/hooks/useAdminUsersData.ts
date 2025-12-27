import { useState, useEffect } from "react";
import { AdminUser, UserFormItem, Pagination } from "../types";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  resetUserPassword,
  getRoles,
} from "@/services/usersApi";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for testing
const mockUsers: AdminUser[] = [
  {
    id: 1,
    email: "john.doe@example.com",
    name: "John Doe",
    phoneNumber: "+1234567890",
    isActive: true,
    lastLoggedInOn: null,
    createdAt: "2025-01-01T00:00:00.000Z",
    requirePasswordReset: false,
    roleId: 1,
    role: {
      id: 1,
      name: "Admin",
      createdAt: "2025-01-01T00:00:00.000Z",
      createdById: null,
      isActive: true,
      lastUpdatedAt: null,
      lastUpdatedById: null,
    },
    sspUser: null,
  },
  {
    id: 2,
    email: "jane.smith@example.com",
    name: "Jane Smith",
    phoneNumber: "+1234567891",
    isActive: true,
    lastLoggedInOn: null,
    createdAt: "2025-01-01T00:00:00.000Z",
    requirePasswordReset: false,
    roleId: 2,
    role: {
      id: 2,
      name: "User",
      createdAt: "2025-01-01T00:00:00.000Z",
      createdById: null,
      isActive: true,
      lastUpdatedAt: null,
      lastUpdatedById: null,
    },
    sspUser: null,
  },
];

export const useAdminUsersData = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [roles, setRoles] = useState<any[]>([]);
  const { user: authUser } = useAuth();

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (authUser?.token) {
          // Fetch users and roles in parallel
          const [usersResponse, rolesResponse] = await Promise.all([
            getAdminUsers(
              pagination.currentPage,
              pagination.pageSize,
              authUser.token,
              searchTerm
            ),
            getRoles(authUser.token),
          ]);

          if (usersResponse.response.code === 200) {
            setUsers(usersResponse.data.data);
            setPagination(usersResponse.data.pagination);
          } else {
            throw new Error(
              usersResponse.response.message || "Failed to fetch users"
            );
          }

          if (rolesResponse.response.code === 200) {
            setRoles(rolesResponse.data.data);
          } else {
            console.warn(
              "Failed to fetch roles:",
              rolesResponse.response.message
            );
          }
        } else {
          // Fallback to mock data if no auth token
          setUsers(mockUsers);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: mockUsers.length,
            pageSize: 10,
          });
          setRoles([
            { id: 1, name: "Admin" },
            { id: 2, name: "Customer" },
            { id: 3, name: "Teacher" },
            { id: 4, name: "Driver" },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Fallback to mock data on error
        setUsers(mockUsers);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: mockUsers.length,
          pageSize: 10,
        });
        setRoles([
          { id: 1, name: "Admin" },
          { id: 2, name: "Customer" },
          { id: 3, name: "Teacher" },
          { id: 4, name: "Driver" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    authUser?.token,
    pagination.currentPage,
    pagination.pageSize,
    searchTerm,
  ]);

  // Add user
  const addUser = async (userData: UserFormItem) => {
    try {
      if (authUser?.token) {
        const response = await createAdminUser(
          {
            name: userData.name,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            roleId: userData.roleId,
            isActive: userData.isActive,
          },
          authUser.token
        );

        if (response.response.code === 200) {
          setUsers((prev) => [...prev, response.data]);
          setPagination((prev) => ({
            ...prev,
            totalItems: prev.totalItems + 1,
          }));
          return response.data;
        } else {
          throw new Error(response.response.message || "Failed to create user");
        }
      } else {
        throw new Error("No authentication token available");
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  };

  // Update user
  const updateUserData = async (user: AdminUser, data: UserFormItem) => {
    try {
      if (authUser?.token) {
        const response = await updateAdminUser(
          user.id,
          {
            name: data.name,
            phoneNumber: data.phoneNumber,
            roleId: data.roleId,
            isActive: data.isActive,
          },
          authUser.token
        );

        if (response.response.code === 200) {
          setUsers((prev) =>
            prev.map((u) => {
              if (u.id === user.id) {
                return response.data;
              }
              return u;
            })
          );
          return response.data;
        } else {
          throw new Error(response.response.message || "Failed to update user");
        }
      } else {
        throw new Error("No authentication token available");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  // Reset user password
  const resetPassword = async (user: AdminUser) => {
    try {
      if (authUser?.token) {
        const response = await resetUserPassword(user.id, authUser.token);

        if (response.response.code === 200) {
          return response.data;
        } else {
          throw new Error(
            response.response.message || "Failed to reset password"
          );
        }
      } else {
        throw new Error("No authentication token available");
      }
    } catch (error) {
      console.error("Failed to reset password:", error);
      throw error;
    }
  };

  // Pagination functions
  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const changePageSize = (pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, currentPage: 1 }));
  };

  // Delete user (keeping for backward compatibility, but not used in UI)
  const deleteUserData = async (user: AdminUser) => {
    try {
      if (authUser?.token) {
        const response = await deleteAdminUser(user.id, authUser.token);

        if (response.success) {
          setUsers((prev) => prev.filter((u) => u.id !== user.id));
          setPagination((prev) => ({
            ...prev,
            totalItems: prev.totalItems - 1,
          }));
          return true;
        } else {
          throw new Error(response.message || "Failed to delete user");
        }
      } else {
        throw new Error("No authentication token available");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  };

  // Search handler
  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page when searching
  };

  return {
    users,
    loading,
    pagination,
    roles,
    searchTerm,
    addUser,
    updateUser: updateUserData,
    resetPassword,
    deleteUser: deleteUserData,
    goToPage,
    changePageSize,
    handleSearch,
  };
};
