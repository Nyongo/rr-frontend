// API service for minders management
import { config } from "@/lib/config";

const API_BASE_URL = config.API_BASE_URL;

export interface School {
  id: string;
  name: string;
  customerId: number;
}

export interface Minder {
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
  school: School;
}

export interface CreateMinderRequest {
  name: string;
  phoneNumber: string;
  schoolId: string;
  status?: string;
  isActive?: boolean;
  pin?: string;
  photo?: string;
}

export interface UpdateMinderRequest extends Partial<CreateMinderRequest> {
  status?: string;
  isActive?: boolean;
}

export interface MindersResponse {
  success: boolean;
  data: Minder[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface MinderResponse {
  success: boolean;
  data: Minder;
}

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

// Get all minders with pagination and search
export const getMinders = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<MindersResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(search && { search }),
  });

  return apiRequest<MindersResponse>(`/academic-suite/minders?${params}`);
};

// Get a specific minder by ID
export const getMinderById = async (id: string): Promise<MinderResponse> => {
  return apiRequest<MinderResponse>(`/academic-suite/minders/${id}`);
};

// Create a new minder
export const createMinder = async (
  data: CreateMinderRequest
): Promise<MinderResponse> => {
  return apiRequest<MinderResponse>("/academic-suite/minders", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing minder
export const updateMinder = async (
  id: string,
  data: UpdateMinderRequest
): Promise<MinderResponse> => {
  return apiRequest<MinderResponse>(`/academic-suite/minders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a minder
export const deleteMinder = async (id: string): Promise<void> => {
  return apiRequest<void>(`/academic-suite/minders/${id}`, {
    method: "DELETE",
  });
};

// Toggle minder status (activate/deactivate)
export const toggleMinderStatus = async (
  id: string,
  isActive: boolean
): Promise<MinderResponse> => {
  return updateMinder(id, {
    isActive,
    status: isActive ? "Active" : "Inactive",
  });
};
