import { config } from "@/lib/config";

const API_BASE_URL = `${config.API_BASE_URL}/academic-suite`;

export interface CreateDriverRequest {
  name: string;
  phoneNumber: string;
  schoolId: string;
}

export interface CreateDriverResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    phoneNumber: string;
    schoolId: string;
    photo: string | null;
    pin: string;
    status: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdById: string | null;
    lastUpdatedById: string | null;
    school: {
      id: string;
      name: string;
      customerId: number;
    };
  };
}

export interface Driver {
  id: string;
  name: string;
  phoneNumber: string;
  schoolId: string;
  photo: string | null;
  pin: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  lastUpdatedById: string | null;
  school: {
    id: string;
    name: string;
    customerId: number;
  };
  // Legacy fields for backward compatibility
  fullName?: string;
  licenseNumber?: string;
  phone?: string;
  schoolName?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface GetDriversResponse {
  success: boolean;
  data: Driver[];
  pagination: Pagination;
}

export const createDriver = async (
  driverData: CreateDriverRequest
): Promise<CreateDriverResponse> => {
  const response = await fetch(`${API_BASE_URL}/drivers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(driverData),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = result.message || result.error || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const getDrivers = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<GetDriversResponse> => {
  const searchParam =
    search && search.trim()
      ? `&search=${encodeURIComponent(search.trim())}`
      : "";
  const response = await fetch(
    `${API_BASE_URL}/drivers?page=${page}&pageSize=${pageSize}${searchParam}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    const errorMessage = result.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const updateDriver = async (
  driverId: string,
  driverData: CreateDriverRequest
): Promise<CreateDriverResponse> => {
  const response = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(driverData),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = result.message || result.error || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const deleteDriver = async (driverId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = result.message || result.error || "API request failed";
    throw new Error(errorMessage);
  }
};
