// Re-export types from the API service for consistency
export type { AdminUser, AdminUserRole, Pagination } from "@/services/usersApi";

export interface UserFormItem {
  name: string;
  email: string;
  phoneNumber?: string;
  roleId: number;
  isActive: boolean;
}
