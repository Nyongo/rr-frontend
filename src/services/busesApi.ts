import { config } from "@/lib/config";

const API_BASE_URL = `${config.API_BASE_URL}/academic-suite`;

export interface CreateBusRequest {
  registrationNumber: string;
  schoolId: string;
  make: string;
  model: string;
  seatsCapacity: number;
  type: string;
  status: string;
  isActive: string;
}

export interface CreateBusResponse {
  success: boolean;
  data: {
    id: string;
    registrationNumber: string;
    schoolId: string;
    make: string;
    model: string;
    seatsCapacity: number;
    type: string;
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

export interface Bus {
  id: string;
  registrationNumber: string;
  schoolId: string;
  make: string;
  model: string;
  seatsCapacity: number;
  type: string;
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
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface GetBusesResponse {
  success: boolean;
  data: Bus[];
  pagination: Pagination;
}

export const createBus = async (
  busData: CreateBusRequest
): Promise<CreateBusResponse> => {
  const response = await fetch(`${API_BASE_URL}/buses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(busData),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = result.message || result.error || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const getBuses = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<GetBusesResponse> => {
  const searchParam =
    search && search.trim()
      ? `&search=${encodeURIComponent(search.trim())}`
      : "";
  const response = await fetch(
    `${API_BASE_URL}/buses?page=${page}&pageSize=${pageSize}${searchParam}`
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

export const updateBus = async (
  busId: string,
  busData: CreateBusRequest
): Promise<CreateBusResponse> => {
  const response = await fetch(`${API_BASE_URL}/buses/${busId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(busData),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = result.message || result.error || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const deleteBus = async (busId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/buses/${busId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }
};
