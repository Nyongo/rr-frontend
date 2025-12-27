// API service for parents management
const API_BASE_URL = "http://localhost:3000";

export interface School {
  id: string;
  name: string;
  customerId: number;
}

export interface Parent {
  id: string;
  name: string;
  parentType: "Mother" | "Father" | "Guardian";
  phoneNumber: string;
  email?: string;
  schoolId: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  lastUpdatedById: string | null;
  school: School;
  // Legacy fields for backward compatibility
  phone?: string;
  studentsCount?: number;
  lastLogin?: string;
}

export interface CreateParentRequest {
  name: string;
  parentType: "Mother" | "Father" | "Guardian";
  phoneNumber: string;
  email?: string;
  schoolId: string;
  status?: string;
  isActive?: boolean;
}

export interface UpdateParentRequest extends Partial<CreateParentRequest> {
  status?: string;
  isActive?: boolean;
}

export interface ParentsResponse {
  success: boolean;
  data: Parent[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ParentResponse {
  success: boolean;
  data: Parent;
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

// Get all parents with pagination and search
export const getParents = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<ParentsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(search && { search }),
  });

  return apiRequest<ParentsResponse>(`/academic-suite/parents?${params}`);
};

// Get a specific parent by ID
export const getParentById = async (id: string): Promise<ParentResponse> => {
  return apiRequest<ParentResponse>(`/academic-suite/parents/${id}`);
};

// Create a new parent
export const createParent = async (
  data: CreateParentRequest
): Promise<ParentResponse> => {
  return apiRequest<ParentResponse>("/academic-suite/parents", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing parent
export const updateParent = async (
  id: string,
  data: UpdateParentRequest
): Promise<ParentResponse> => {
  return apiRequest<ParentResponse>(`/academic-suite/parents/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a parent
export const deleteParent = async (id: string): Promise<void> => {
  return apiRequest<void>(`/academic-suite/parents/${id}`, {
    method: "DELETE",
  });
};

// Toggle parent status (activate/deactivate)
export const toggleParentStatus = async (
  id: string,
  isActive: boolean
): Promise<ParentResponse> => {
  return updateParent(id, {
    isActive,
    status: isActive ? "Active" : "Inactive",
  });
};
