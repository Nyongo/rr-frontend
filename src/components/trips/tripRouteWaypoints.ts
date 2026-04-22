import type { Trip } from "@/services/tripsApi";

/**
 * Ordered stops for a planned route preview: trip start → student pickups → trip end.
 * Dedupes consecutive identical (or near-identical) coordinates.
 */
export function buildTripRouteWaypoints(trip: Trip): { lat: number; lng: number }[] {
  const pts: { lat: number; lng: number }[] = [];

  const add = (lat: number, lng: number) => {
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      return;
    }
    const last = pts[pts.length - 1];
    if (
      last &&
      Math.abs(last.lat - lat) < 1e-5 &&
      Math.abs(last.lng - lng) < 1e-5
    ) {
      return;
    }
    pts.push({ lat, lng });
  };

  if (trip.startGps) {
    add(trip.startGps.latitude, trip.startGps.longitude);
  }

  for (const ts of trip.tripStudents || []) {
    if (ts.pickupGps) {
      add(ts.pickupGps.latitude, ts.pickupGps.longitude);
    }
  }

  if (trip.endGps) {
    add(trip.endGps.latitude, trip.endGps.longitude);
  }

  return pts;
}
