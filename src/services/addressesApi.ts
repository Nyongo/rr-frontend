// API service for addresses management
import { config } from "@/lib/config";

const API_BASE_URL = config.API_BASE_URL;

export interface Parent {
  id: string;
  name: string;
  phoneNumber: string;
}

export interface Address {
  id: string;
  addressType: string;
  location: string;
  longitude: number;
  latitude: number;
  status: string;
  isPrimary: boolean;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  lastUpdatedById: string | null;
  parent: Parent;
  // Legacy fields for backward compatibility
  type?: string;
}

export interface CreateAddressRequest {
  addressType: string;
  location: string;
  longitude: number;
  latitude: number;
  status?: string;
  isPrimary?: boolean;
  parentId: string;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {
  status?: string;
  isPrimary?: boolean;
}

export interface AddressesResponse {
  success: boolean;
  data: Address[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface AddressResponse {
  success: boolean;
  data: Address;
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

// Get addresses by parent ID
export const getAddressesByParentId = async (
  parentId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<AddressesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    parentId: parentId,
  });

  return apiRequest<AddressesResponse>(`/academic-suite/addresses?${params}`);
};

// Get a specific address by ID
export const getAddressById = async (id: string): Promise<AddressResponse> => {
  return apiRequest<AddressResponse>(`/academic-suite/addresses/${id}`);
};

// Create a new address
export const createAddress = async (
  data: CreateAddressRequest
): Promise<AddressResponse> => {
  return apiRequest<AddressResponse>("/academic-suite/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing address
export const updateAddress = async (
  id: string,
  data: UpdateAddressRequest
): Promise<AddressResponse> => {
  return apiRequest<AddressResponse>(`/academic-suite/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete an address
export const deleteAddress = async (id: string): Promise<void> => {
  return apiRequest<void>(`/academic-suite/addresses/${id}`, {
    method: "DELETE",
  });
};

// Toggle address status (activate/deactivate)
export const toggleAddressStatus = async (
  id: string,
  status: string
): Promise<AddressResponse> => {
  return updateAddress(id, {
    status,
  });
};
