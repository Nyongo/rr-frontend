import { config } from "@/lib/config";

const API_BASE_URL = `${config.API_BASE_URL}/academic-suite`;

export interface CreateTripRequest {
  routeId: string;
  busId: string;
  driverId: string;
  minderId: string | null;
  tripDate: string; // Date in YYYY-MM-DD format
  students: Array<{
    studentId: string;
  }>;
}

export interface UpdateTripRequest {
  busId?: string;
  driverId?: string;
  minderId?: string | null;
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
  minderId: string | null;
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
  } | null;
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

export interface TrackingLocation {
  id: number;
  tripId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed: number | null;
  heading: number | null;
  accuracy: number | null;
}

export interface TrackingResponse {
  success: boolean;
  data: {
    student: {
      id: string;
      name: string;
      admissionNumber: string;
    };
    trip: {
      id: string;
      tripDate: string;
      status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
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
      };
    };
    pickupStatus: "NOT_PICKED_UP" | "PICKED_UP";
    dropoffStatus: "NOT_DROPPED_OFF" | "DROPPED_OFF";
    actualPickupTime: string | null;
    actualDropoffTime: string | null;
    pickupLocation: string | null;
    dropoffLocation: string | null;
    currentLocation: TrackingLocation | null;
    locationHistory: TrackingLocation[];
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

export const getTrip = async (
  tripId: string
): Promise<{ success: boolean; data: Trip }> => {
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

export const endTrip = async (
  tripId: string
): Promise<{ success: boolean; data: Trip }> => {
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

// Get active trips for a student by student ID or admission number
export const getTripsByStudent = async (
  studentId?: string,
  admissionNumber?: string
): Promise<GetTripsResponse> => {
  const params = new URLSearchParams({
    page: "1",
    pageSize: "10",
  });

  if (studentId) {
    params.append("studentId", studentId);
  }

  if (admissionNumber) {
    params.append("admissionNumber", admissionNumber);
  }

  const response = await fetch(`${API_BASE_URL}/trips?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch trips for student");
  }

  const result = await response.json();

  if (result.response?.code && result.response.code !== 200) {
    throw new Error(result.response.message || "API request failed");
  }

  return result;
};

// Public tracking endpoint for parents
export const getTripByTrackingToken = async (
  trackingToken: string
): Promise<TrackingResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/track/${encodeURIComponent(trackingToken)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tracking information");
  }

  const result = await response.json();

  if (result.response?.code && result.response.code !== 200) {
    throw new Error(result.response.message || "API request failed");
  }

  return result;
};
