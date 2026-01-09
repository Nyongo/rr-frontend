import { config } from "@/lib/config";

const API_BASE_URL = `${config.API_BASE_URL}/admin/telemetry`;

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
      errorData.message || errorData.error?.message || `HTTP error! status: ${response.status}`
    );
  }

  const result = await response.json();

  if (result.response?.code && result.response.code !== 200) {
    throw new Error(result.response.message || "API request failed");
  }

  return result;
};

// System-Wide Summary Types
export interface SystemSummary {
  schools: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    growthRate: number;
  };
  customers: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    growthRate: number;
    subscriptions: {
      active: number;
      expired: number;
      pending: number;
    };
  };
  students: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    growthRate: number;
    byGrade: Array<{
      grade: string;
      count: number;
    }>;
  };
  rfid: {
    totalTags: number;
    activeTags: number;
    inactiveTags: number;
    assignedTags: number;
    unassignedTags: number;
    replacementTags: number;
    averageTagAge: number;
    tagsByStatus: {
      active: number;
      inactive: number;
      damaged: number;
      lost: number;
      pending: number;
    };
  };
  buses: {
    total: number;
    active: number;
    inactive: number;
    inService: number;
    maintenance: number;
    totalCapacity: number;
    averageCapacity: number;
  };
  routes: {
    total: number;
    active: number;
    inactive: number;
    morningRoutes: number;
    afternoonRoutes: number;
  };
  drivers: {
    total: number;
    active: number;
    inactive: number;
    licensed: number;
    certified: number;
  };
  minders: {
    total: number;
    active: number;
    inactive: number;
    certified: number;
  };
  parents: {
    total: number;
    active: number;
    inactive: number;
    verified: number;
    unverified: number;
    newThisMonth: number;
  };
}

export interface SystemSummaryResponse {
  success: boolean;
  data: SystemSummary;
}

// Telemetry Summary Types
export interface TelemetrySummary {
  period: {
    from: string;
    to: string;
  };
  rfid: {
    totalAttempts: number;
    successfulScans: number;
    failures: number;
    successRate: number;
    averageScanTime: number;
    peakHour: string;
    totalDevices: number;
    activeDevices: number;
  };
  sms: {
    totalAttempts: number;
    successfulDeliveries: number;
    failures: number;
    successRate: number;
    averageDeliveryTime: number;
    peakHour: string;
    providers: Array<{
      name: string;
      deliveries: number;
      successRate: number;
    }>;
  };
  trips: {
    totalTrips: number;
    completedTrips: number;
    inProgressTrips: number;
    cancelledTrips: number;
    averageDuration: number;
    totalStudentsTracked: number;
    totalDistance: number;
  };
  system: {
    uptime: number;
    averageResponseTime: number;
    apiErrors: number;
    databaseQueries: number;
    cacheHitRate: number;
  };
  previousPeriod?: {
    rfid: {
      totalAttempts: number;
      successfulScans: number;
      failures: number;
      successRate: number;
    };
    sms: {
      totalAttempts: number;
      successfulDeliveries: number;
      failures: number;
      successRate: number;
    };
  };
}

export interface TelemetrySummaryResponse {
  success: boolean;
  data: TelemetrySummary;
}

// Daily Statistics Types
export interface DailyStatistics {
  date: string;
  rfid: {
    attempts: number;
    successes: number;
    failures: number;
  };
  sms: {
    attempts: number;
    successes: number;
    failures: number;
  };
  trips: {
    scheduled: number;
    completed: number;
    cancelled: number;
  };
}

export interface DailyStatisticsResponse {
  success: boolean;
  data: DailyStatistics[];
}

// Device Performance Types
export interface DevicePerformance {
  deviceId: string;
  busId: string;
  busRegistration: string;
  totalScans: number;
  failures: number;
  successRate: number;
  lastActive: string;
  averageScanTime?: number;
  totalUptime?: number;
}

export interface DevicePerformanceResponse {
  success: boolean;
  data: DevicePerformance[];
}

// Route Performance Types
export interface RoutePerformance {
  routeId: string;
  routeName: string;
  trips: number;
  avgDuration: number;
  onTimeRate: number;
  studentsServed: number;
  totalDistance?: number;
  averageDistance?: number;
  totalPickups?: number;
  totalDropoffs?: number;
}

export interface RoutePerformanceResponse {
  success: boolean;
  data: RoutePerformance[];
}

// RFID Failure Types
export interface RFIDFailure {
  id: string;
  deviceId: string;
  appVersion: string;
  busId: string;
  busRegistration: string;
  rfidTagId: string;
  student: {
    id: string;
    name: string;
    photo: string;
    dateOfBirth: string;
    age: number;
  };
  minderId: string;
  minderName: string;
  failureTime: string;
  failureReason: string;
  tripId?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface RFIDFailuresResponse {
  success: boolean;
  data: {
    failures: RFIDFailure[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

// SMS Failure Types
export interface SMSFailure {
  id: string;
  parentId: string;
  parentName: string;
  phoneNumber: string;
  tripId: string;
  trip: {
    id: string;
    number: string;
    route: {
      id: string;
      name: string;
    };
    startTime: string;
    endTime: string;
    status: string;
    driver: {
      id: string;
      name: string;
    };
    bus: {
      id: string;
      registrationNumber: string;
    };
  };
  failureTime: string;
  failureReason: string;
  messageType?: string;
  provider?: string;
  retryCount?: number;
}

export interface SMSFailuresResponse {
  success: boolean;
  data: {
    failures: SMSFailure[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

// Failure Reasons Types
export interface FailureReason {
  reason: string;
  count: number;
  percentage: number;
}

export interface FailureReasonsResponse {
  success: boolean;
  data: {
    rfid: FailureReason[];
    sms: FailureReason[];
  };
}

// API Functions

// Get System-Wide Summary
export const getSystemSummary = async (): Promise<SystemSummaryResponse> => {
  return apiRequest<SystemSummaryResponse>("/system-summary");
};

// Get Telemetry Summary
export const getTelemetrySummary = async (
  from: string,
  to: string,
  compare?: boolean
): Promise<TelemetrySummaryResponse> => {
  const params = new URLSearchParams({
    from,
    to,
  });
  if (compare) {
    params.append("compare", "true");
  }
  return apiRequest<TelemetrySummaryResponse>(`/summary?${params.toString()}`);
};

// Get Daily Statistics
export const getDailyStatistics = async (
  from: string,
  to: string
): Promise<DailyStatisticsResponse> => {
  const params = new URLSearchParams({
    from,
    to,
  });
  return apiRequest<DailyStatisticsResponse>(`/daily?${params.toString()}`);
};

// Get Device Performance
export const getDevicePerformance = async (
  from: string,
  to: string,
  deviceId?: string,
  busId?: string
): Promise<DevicePerformanceResponse> => {
  const params = new URLSearchParams({
    from,
    to,
  });
  if (deviceId) params.append("deviceId", deviceId);
  if (busId) params.append("busId", busId);
  return apiRequest<DevicePerformanceResponse>(`/devices?${params.toString()}`);
};

// Get Route Performance
export const getRoutePerformance = async (
  from: string,
  to: string,
  routeId?: string
): Promise<RoutePerformanceResponse> => {
  const params = new URLSearchParams({
    from,
    to,
  });
  if (routeId) params.append("routeId", routeId);
  return apiRequest<RoutePerformanceResponse>(`/routes?${params.toString()}`);
};

// Get RFID Failures (may be a placeholder endpoint)
export const getRFIDFailures = async (
  from?: string,
  to?: string,
  deviceId?: string,
  busId?: string,
  studentId?: string,
  page: number = 1,
  pageSize: number = 50,
  search?: string
): Promise<RFIDFailuresResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  if (deviceId) params.append("deviceId", deviceId);
  if (busId) params.append("busId", busId);
  if (studentId) params.append("studentId", studentId);
  if (search) params.append("search", search);
  try {
    return await apiRequest<RFIDFailuresResponse>(`/rfid-failures?${params.toString()}`);
  } catch (error) {
    // If endpoint returns 404 or similar, return empty response for placeholder
    if (error instanceof Error && error.message.includes("404")) {
      return { success: true, data: { failures: [], pagination: { page, pageSize, total: 0, totalPages: 0 } } };
    }
    throw error;
  }
};

// Get SMS Failures (may be a placeholder endpoint)
export const getSMSFailures = async (
  from?: string,
  to?: string,
  tripId?: string,
  parentId?: string,
  page: number = 1,
  pageSize: number = 50,
  search?: string
): Promise<SMSFailuresResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  if (tripId) params.append("tripId", tripId);
  if (parentId) params.append("parentId", parentId);
  if (search) params.append("search", search);
  try {
    return await apiRequest<SMSFailuresResponse>(`/sms-failures?${params.toString()}`);
  } catch (error) {
    // If endpoint returns 404 or similar, return empty response for placeholder
    if (error instanceof Error && error.message.includes("404")) {
      return { success: true, data: { failures: [], pagination: { page, pageSize, total: 0, totalPages: 0 } } };
    }
    throw error;
  }
};

// Get Failure Reasons (may be a placeholder endpoint)
export const getFailureReasons = async (
  from: string,
  to: string,
  type?: "rfid" | "sms" | "all"
): Promise<FailureReasonsResponse> => {
  const params = new URLSearchParams({
    from,
    to,
  });
  if (type) params.append("type", type);
  try {
    return await apiRequest<FailureReasonsResponse>(`/failure-reasons?${params.toString()}`);
  } catch (error) {
    // If endpoint returns 404 or similar, return empty response for placeholder
    if (error instanceof Error && error.message.includes("404")) {
      return { success: true, data: { rfid: [], sms: [] } };
    }
    throw error;
  }
};
