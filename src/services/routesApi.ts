import { config } from "@/lib/config";

const API_BASE_URL = `${config.API_BASE_URL}/academic-suite`;

export interface CreateRouteRequest {
  name: string;
  schoolId: string;
  tripType:
    | "MORNING_PICKUP"
    | "EVENING_DROPOFF"
    | "FIELD_TRIP"
    | "EXTRA_CURRICULUM"
    | "EMERGENCY";
  description?: string;
  status?: "Active" | "Inactive";
  busId?: string | null;
  driverId?: string | null;
  minderId?: string | null;
  students?: string[]; // Array of student IDs
  studentsWithRiderType?: Array<{
    studentId: string;
    riderType: "DAILY" | "OCCASIONAL";
  }>;
}

export interface UpdateRouteRequest {
  name?: string;
  description?: string;
  status?: "Active" | "Inactive";
  tripType?: "MORNING_PICKUP" | "EVENING_DROPOFF" | "FIELD_TRIP" | "EXTRA_CURRICULUM" | "EMERGENCY";
  busId?: string | null;
  driverId?: string | null;
  minderId?: string | null;
  students?: string[]; // Array of student IDs to add
  studentsWithRiderType?: Array<{
    studentId: string;
    riderType: "DAILY" | "OCCASIONAL";
  }>;
  studentsToRemove?: string[]; // Array of student IDs to remove
  isActive?: boolean;
}

export interface RouteResponse {
  id: string;
  name: string;
  schoolId: string;
  tripType:
    | "MORNING_PICKUP"
    | "EVENING_DROPOFF"
    | "FIELD_TRIP"
    | "EXTRA_CURRICULUM"
    | "EMERGENCY";
  description: string;
  status: "Active" | "Inactive";
  isActive: boolean;
  busId: string | null;
  driverId: string | null;
  minderId: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  lastUpdatedById: string | null;
  school: {
    id: string;
    name: string;
    customerId: number;
  };
  bus: {
    id: string;
    registrationNumber: string;
    make: string;
    model: string;
  } | null;
  driver: {
    id: string;
    name: string;
    phoneNumber: string;
    pin: string;
  } | null;
  minder: {
    id: string;
    name: string;
    phoneNumber: string;
    pin: string;
  } | null;
  routeStudents: Array<{
    id: string;
    routeId: string;
    studentId: string;
    riderType: "DAILY" | "OCCASIONAL";
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    student: {
      id: string;
      name: string;
      admissionNumber: string;
      gender?: string;
      dateOfBirth?: string;
      photo?: string | null;
      parent?: {
        id: string;
        name: string;
        phoneNumber: string;
      };
    };
  }>;
}

export interface CreateRouteResponse {
  success: boolean;
  data: RouteResponse;
}

export interface GetRoutesResponse {
  success: boolean;
  data: RouteResponse[];
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export const createRoute = async (
  routeData: CreateRouteRequest
): Promise<CreateRouteResponse> => {
  // Validate and clean the payload before sending
  const cleanedPayload: CreateRouteRequest = {
    ...routeData,
  };

  // Ensure studentsWithRiderType has valid studentIds
  if (cleanedPayload.studentsWithRiderType) {
    cleanedPayload.studentsWithRiderType = cleanedPayload.studentsWithRiderType
      .filter((student) => student.studentId && student.studentId.trim() !== "")
      .map((student) => ({
        studentId: student.studentId.trim(),
        riderType: student.riderType,
      }));
  }

  // Ensure students array has valid IDs
  if (cleanedPayload.students) {
    cleanedPayload.students = cleanedPayload.students
      .filter((id) => id && typeof id === "string" && id.trim() !== "")
      .map((id) => id.trim());
  }

  console.log("🚀 Sending route creation request:", JSON.stringify(cleanedPayload, null, 2));

  const response = await fetch(`${API_BASE_URL}/routes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanedPayload),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage =
      result.response?.message || result.message || "Failed to create route";
    throw new Error(errorMessage);
  }

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const getRoutes = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<GetRoutesResponse> => {
  const searchParam =
    search && search.trim()
      ? `&search=${encodeURIComponent(search.trim())}`
      : "";
  const response = await fetch(
    `${API_BASE_URL}/routes?page=${page}&pageSize=${pageSize}${searchParam}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const updateRoute = async (
  routeId: string,
  routeData: UpdateRouteRequest
): Promise<CreateRouteResponse> => {
  // Validate and clean the payload before sending
  const cleanedPayload: UpdateRouteRequest = {
    ...routeData,
  };

  // Ensure studentsWithRiderType has valid studentIds
  if (cleanedPayload.studentsWithRiderType) {
    cleanedPayload.studentsWithRiderType = cleanedPayload.studentsWithRiderType
      .filter((student) => student.studentId && student.studentId.trim() !== "")
      .map((student) => ({
        studentId: student.studentId.trim(),
        riderType: student.riderType,
      }));
  }

  // Ensure students array has valid IDs
  if (cleanedPayload.students) {
    cleanedPayload.students = cleanedPayload.students
      .filter((id) => id && typeof id === "string" && id.trim() !== "")
      .map((id) => id.trim());
  }

  // Ensure studentsToRemove array has valid IDs
  if (cleanedPayload.studentsToRemove) {
    cleanedPayload.studentsToRemove = cleanedPayload.studentsToRemove
      .filter((id) => id && typeof id === "string" && id.trim() !== "")
      .map((id) => id.trim());
  }

  console.log("🔄 Sending route update request:", JSON.stringify(cleanedPayload, null, 2));

  const response = await fetch(`${API_BASE_URL}/routes/${routeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanedPayload),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage =
      result.response?.message || result.message || "Failed to update route";
    throw new Error(errorMessage);
  }

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const deleteRoute = async (routeId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/routes/${routeId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json();
    const errorMessage =
      result.response?.message || result.message || "Failed to delete route";
    throw new Error(errorMessage);
  }

  const result = await response.json();

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }
};

// Bulk student addition types and functions
export interface BulkStudentRequest {
  studentId: string;
  riderType: "DAILY" | "OCCASIONAL";
}

export interface BulkStudentsRequest {
  students: BulkStudentRequest[];
}

export interface RouteStudentResponse {
  id: string;
  routeId: string;
  studentId: string;
  riderType: "DAILY" | "OCCASIONAL";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    admissionNumber: string;
    gender: string;
  };
}

export interface BulkStudentsResponse {
  success: boolean;
  data: {
    successful: RouteStudentResponse[];
    failed: Array<{
      studentId: string;
      error: string;
    }>;
    totalRequested: number;
    totalSuccessful: number;
    totalFailed: number;
  };
}

export const addStudentsToRoute = async (
  routeId: string,
  studentsData: BulkStudentsRequest
): Promise<BulkStudentsResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/routes/${routeId}/students/bulk`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentsData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const errorMessage =
      result.response?.message ||
      result.message ||
      "Failed to add students to route";
    throw new Error(errorMessage);
  }

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

// Remove student from route types and functions
export interface RemoveStudentResponse {
  success: boolean;
  data: {
    count: number;
  };
}

export const removeStudentFromRoute = async (
  routeId: string,
  studentId: string
): Promise<RemoveStudentResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/routes/${routeId}/students/${studentId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const errorMessage =
      result.response?.message ||
      result.message ||
      "Failed to remove student from route";
    throw new Error(errorMessage);
  }

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

// Get students in a route types and functions
export interface RouteStudentDetail {
  id: string;
  routeId: string;
  studentId: string;
  riderType: "DAILY" | "OCCASIONAL";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    admissionNumber: string;
    gender?: string;
    dateOfBirth?: string;
    photo?: string | null;
    parent?: {
      id: string;
      name: string;
      phoneNumber: string;
    };
  };
}

export interface GetRouteStudentsResponse {
  success: boolean;
  data: RouteStudentDetail[];
}

export const getRouteStudents = async (
  routeId: string,
  riderType?: "DAILY" | "OCCASIONAL"
): Promise<GetRouteStudentsResponse> => {
  const queryParams = riderType ? `?riderType=${riderType}` : "";
  const response = await fetch(
    `${API_BASE_URL}/routes/${routeId}/students${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const errorMessage =
      result.response?.message ||
      result.message ||
      "Failed to fetch route students";
    throw new Error(errorMessage);
  }

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};
