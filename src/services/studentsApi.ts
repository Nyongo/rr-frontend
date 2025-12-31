// API service for students management
import { config } from "@/lib/config";

const API_BASE_URL = config.API_BASE_URL;

export interface School {
  id: string;
  name: string;
  customerId: number;
}

export interface Parent {
  id: string;
  name: string;
  parentType: string;
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
}

export interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  status: string;
  isActive: boolean;
  specialNeeds: string[];
  medicalInfo: string;
  schoolId: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  lastUpdatedById: string | null;
  school: School;
  parent: Parent;
  // Legacy fields for backward compatibility
  photo?: string;
  schoolName?: string;
  medicalInformation?: string;
  fingerprint?: string;
  // RFID tracking
  rfidTagId?: string | null;
  rfidTagAssignedAt?: string | null;
}

export interface CreateStudentRequest {
  name: string;
  admissionNumber: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  status?: string;
  isActive?: boolean;
  specialNeeds?: string[];
  medicalInfo?: string;
  schoolId: string;
  parentId: string;
  rfidTagId?: string | null;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  status?: string;
  isActive?: boolean;
}

export interface StudentsResponse {
  success: boolean;
  data: Student[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface StudentResponse {
  success: boolean;
  data: Student;
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

// Get all students with pagination and search
export const getStudents = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<StudentsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(search && { search }),
  });

  return apiRequest<StudentsResponse>(`/academic-suite/students?${params}`);
};

// Get students by parent ID
export const getStudentsByParentId = async (
  parentId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<StudentsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    parentId: parentId,
  });

  return apiRequest<StudentsResponse>(`/academic-suite/students?${params}`);
};

// Get students by school ID
export const getStudentsBySchoolId = async (
  schoolId: string,
  page: number = 1,
  pageSize: number = 100,
  search?: string
): Promise<StudentsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    schoolId: schoolId,
    ...(search && { search }),
  });

  return apiRequest<StudentsResponse>(`/academic-suite/students?${params}`);
};

// Get a specific student by ID
export const getStudentById = async (id: string): Promise<StudentResponse> => {
  return apiRequest<StudentResponse>(`/academic-suite/students/${id}`);
};

// Create a new student
export const createStudent = async (
  data: CreateStudentRequest
): Promise<StudentResponse> => {
  return apiRequest<StudentResponse>("/academic-suite/students", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing student
export const updateStudent = async (
  id: string,
  data: UpdateStudentRequest
): Promise<StudentResponse> => {
  return apiRequest<StudentResponse>(`/academic-suite/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a student
export const deleteStudent = async (id: string): Promise<void> => {
  return apiRequest<void>(`/academic-suite/students/${id}`, {
    method: "DELETE",
  });
};

// Toggle student status (activate/deactivate)
export const toggleStudentStatus = async (
  id: string,
  isActive: boolean
): Promise<StudentResponse> => {
  return updateStudent(id, {
    isActive,
    status: isActive ? "Active" : "Inactive",
  });
};
