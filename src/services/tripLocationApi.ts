import { config } from "@/lib/config";

const API_BASE_URL = `${config.API_BASE_URL}/academic-suite`;

export interface TripLocation {
  id: number;
  tripId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed: number;
  heading: number;
  accuracy: number;
}

export interface TripLocationResponse {
  success: boolean;
  data: TripLocation;
}

export interface TripLocationHistoryResponse {
  success: boolean;
  data: TripLocation[];
}

/**
 * Get the most recent location for a trip
 */
export const getTripCurrentLocation = async (
  tripId: string
): Promise<TripLocationResponse> => {
  const response = await fetch(`${API_BASE_URL}/trips/${tripId}/location`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trip location");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch trip location");
  }

  return result;
};

/**
 * Get location history for a trip
 */
export const getTripLocationHistory = async (
  tripId: string
): Promise<TripLocationHistoryResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/trips/${tripId}/location/history`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch trip location history");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch trip location history");
  }

  return result;
};

