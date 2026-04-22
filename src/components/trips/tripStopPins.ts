import type { Trip } from "@/services/tripsApi";

/** Map marker for a student pickup or drop-off location */
export interface TripStopPin {
  id: string;
  kind: "pickup" | "dropoff";
  latitude: number;
  longitude: number;
  studentName?: string;
}

/**
 * Builds pins from trip student records that include pickup/dropoff GPS.
 */
export function buildTripStopPins(trip: Trip | null | undefined): TripStopPin[] {
  if (!trip?.tripStudents?.length) return [];

  const pins: TripStopPin[] = [];

  for (const ts of trip.tripStudents) {
    const name = ts.student?.name;

    if (ts.pickupGps) {
      pins.push({
        id: `${ts.id}-pickup`,
        kind: "pickup",
        latitude: ts.pickupGps.latitude,
        longitude: ts.pickupGps.longitude,
        studentName: name,
      });
    }
    if (ts.dropoffGps) {
      pins.push({
        id: `${ts.id}-dropoff`,
        kind: "dropoff",
        latitude: ts.dropoffGps.latitude,
        longitude: ts.dropoffGps.longitude,
        studentName: name,
      });
    }
  }

  return pins;
}
