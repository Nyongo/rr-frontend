const API_BASE_URL = "http://localhost:3000";

export interface AdminUserRole {
  id: number;
  name: string;
  createdAt: string;
  createdById: number | null;
  isActive: boolean;
  lastUpdatedAt: string | null;
  lastUpdatedById: number | null;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLoggedInOn: string | null;
  createdAt: string;
  requirePasswordReset: boolean;
  roleId: number | null;
  role: AdminUserRole | null;
  sspUser: any;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface GetAdminUsersResponse {
  response: {
    code: number;
    message: string;
  };
  data: {
    data: AdminUser[];
    pagination: Pagination;
  };
}

export interface Role {
  id: number;
  name: string;
  createdAt: string;
  createdById: number | null;
  isActive: boolean;
  lastUpdatedAt: string | null;
  lastUpdatedById: number | null;
  permissions: any[];
  users: {
    id: number;
    email: string;
    name: string;
  }[];
}

export interface GetRolesResponse {
  response: {
    code: number;
    message: string;
  };
  data: {
    data: Role[];
    pagination: Pagination;
  };
}

export const getAdminUsers = async (
  page: number = 1,
  pageSize: number = 10,
  token: string,
  search?: string
): Promise<GetAdminUsersResponse> => {
  const searchParam =
    search && search.trim()
      ? `&search=${encodeURIComponent(search.trim())}`
      : "";
  const response = await fetch(
    `${API_BASE_URL}/users?page=${page}&pageSize=${pageSize}${searchParam}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

export const getRoles = async (token: string): Promise<GetRolesResponse> => {
  const response = await fetch(`${API_BASE_URL}/roles`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

export const createAdminUser = async (
  userData: {
    name: string;
    email: string;
    phoneNumber?: string;
    roleId: number;
    isActive: boolean;
  },
  token: string
): Promise<{
  response: { code: number; message: string };
  data: AdminUser;
}> => {
  // Prepare the request body, only including phoneNumber if it's provided and not empty
  const requestBody: any = {
    name: userData.name,
    email: userData.email,
    roleId: userData.roleId,
    isActive: userData.isActive,
  };

  // Only include phoneNumber if it's provided and not empty
  if (userData.phoneNumber && userData.phoneNumber.trim() !== "") {
    requestBody.phoneNumber = userData.phoneNumber.trim();
  }

  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();

  // Check the response code instead of HTTP status
  if (result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const updateAdminUser = async (
  userId: number,
  userData: {
    name: string;
    phoneNumber?: string;
    roleId: number;
    isActive: boolean;
  },
  token: string
): Promise<{
  response: { code: number; message: string };
  data: AdminUser;
}> => {
  // Prepare the request body, only including phoneNumber if it's provided and not empty
  const requestBody: any = {
    name: userData.name,
    roleId: userData.roleId,
    isActive: userData.isActive,
  };

  // Only include phoneNumber if it's provided and not empty
  if (userData.phoneNumber && userData.phoneNumber.trim() !== "") {
    requestBody.phoneNumber = userData.phoneNumber.trim();
  }

  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();

  // Check the response code instead of HTTP status
  if (result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const resetUserPassword = async (
  userId: number,
  token: string
): Promise<{
  response: { code: number; message: string };
  data: {
    id: number;
    email: string;
    name: string;
    roleId: number;
  };
}> => {
  const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: userId }),
  });

  const result = await response.json();

  // Check the response code instead of HTTP status
  if (result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const changeUserPassword = async (
  passwordData: {
    id: number;
    newPassword: string;
    repeatNewPassword: string;
    currentPassword: string;
  },
  token: string
): Promise<{
  response: { code: number; message: string };
  data: null;
}> => {
  const response = await fetch(`${API_BASE_URL}/users/change-password`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });

  const result = await response.json();

  // Check the response code instead of HTTP status
  if (result.response.code !== 200) {
    const errorMessage = result.response.message || "Failed to change password";
    throw new Error(errorMessage);
  }

  return result;
};

export const updateUserProfile = async (
  userId: number,
  profileData: {
    name: string;
    phoneNumber?: string;
  },
  token: string
): Promise<{
  response: { code: number; message: string };
  data: AdminUser;
}> => {
  // Prepare the request body, only including phoneNumber if it's provided and not empty
  const requestBody: any = {
    name: profileData.name,
  };

  // Only include phoneNumber if it's provided and not empty
  if (profileData.phoneNumber && profileData.phoneNumber.trim() !== "") {
    requestBody.phoneNumber = profileData.phoneNumber.trim();
  }

  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();

  // Check the response code instead of HTTP status
  if (result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const deleteAdminUser = async (
  userId: number,
  token: string
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};
