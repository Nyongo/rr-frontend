const API_BASE_URL = "http://localhost:3000/academic-suite";

export interface CreateTripRequest {
  routeId: string;
  busId: string;
  driverId: string;
  minderId: string;
  tripDate: string; // Date in YYYY-MM-DD format
  students: Array<{
    studentId: string;
  }>;
}

export interface UpdateTripRequest {
  busId?: string;
  driverId?: string;
  minderId?: string;
  tripDate?: string;
  students?: Array<{
    studentId: string;
  }>;
  status?: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export interface TripStudent {
  id: string;
  tripId: string;
  studentId: string;
  pickupStatus: "NOT_PICKED_UP" | "PICKED_UP";
  dropoffStatus: "NOT_DROPPED_OFF" | "DROPPED_OFF";
  scheduledPickupTime: string | null;
  actualPickupTime: string | null;
  scheduledDropoffTime: string | null;
  actualDropoffTime: string | null;
  pickupLocation: string | null;
  dropoffLocation: string | null;
  pickupGps: { latitude: number; longitude: number } | null;
  dropoffGps: { latitude: number; longitude: number } | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    admissionNumber: string;
  };
}

export interface Trip {
  id: string;
  routeId: string;
  busId: string;
  driverId: string;
  minderId: string;
  tripDate: string; // ISO date string
  scheduledStartTime: string | null; // ISO date string
  actualStartTime: string | null; // ISO date string
  scheduledEndTime: string | null; // ISO date string
  actualEndTime: string | null; // ISO date string
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  notes: string | null;
  startLocation: string | null;
  endLocation: string | null;
  startGps: { latitude: number; longitude: number } | null;
  endGps: { latitude: number; longitude: number } | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  lastUpdatedById: string | null;
  route: {
    id: string;
    name: string;
    tripType: string;
  };
  bus: {
    id: string;
    registrationNumber: string;
    make: string;
    model: string;
  };
  driver: {
    id: string;
    name: string;
    phoneNumber: string;
    pin: string;
  };
  minder: {
    id: string;
    name: string;
    phoneNumber: string;
    pin: string;
  };
  tripStudents: TripStudent[];
}

export interface CreateTripResponse {
  success: boolean;
  data: Trip;
}

export interface GetTripsResponse {
  success: boolean;
  data: Trip[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export const createTrip = async (
  tripData: CreateTripRequest
): Promise<CreateTripResponse> => {
  console.log("🚀 Creating trip:", JSON.stringify(tripData, null, 2));

  const response = await fetch(`${API_BASE_URL}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage =
      result.response?.message || result.message || "Failed to create trip";
    throw new Error(errorMessage);
  }

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const getTrips = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  status?: string
): Promise<GetTripsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (search) {
    params.append("search", search);
  }

  if (status) {
    params.append("status", status);
  }

  const response = await fetch(`${API_BASE_URL}/trips?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  const result = await response.json();

  if (result.response?.code && result.response.code !== 200) {
    throw new Error(result.response.message || "API request failed");
  }

  return result;
};

export const getTrip = async (tripId: string): Promise<{ success: boolean; data: Trip }> => {
  const response = await fetch(`${API_BASE_URL}/trips/${tripId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch trip");
  }

  const result = await response.json();

  if (result.response?.code && result.response.code !== 200) {
    throw new Error(result.response.message || "API request failed");
  }

  return result;
};

export const updateTrip = async (
  tripId: string,
  tripData: UpdateTripRequest
): Promise<{ success: boolean; data: Trip }> => {
  console.log("🔄 Updating trip:", tripId, JSON.stringify(tripData, null, 2));

  const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage =
      result.response?.message || result.message || "Failed to update trip";
    throw new Error(errorMessage);
  }

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const deleteTrip = async (tripId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json();
    const errorMessage =
      result.response?.message || result.message || "Failed to delete trip";
    throw new Error(errorMessage);
  }
};

export const endTrip = async (tripId: string): Promise<{ success: boolean; data: Trip }> => {
  console.log("🏁 Ending trip:", tripId);

  const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "COMPLETED",
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage =
      result.response?.message || result.message || "Failed to end trip";
    throw new Error(errorMessage);
  }

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

