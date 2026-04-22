import { config } from "@/lib/config";

export type LatLngPoint = { lat: number; lng: number };

const MAX_POINTS_PER_REQUEST = 48;

function samplePoints(points: LatLngPoint[], max: number): LatLngPoint[] {
  if (points.length <= max) return points;
  const out: LatLngPoint[] = [];
  for (let i = 0; i < max; i++) {
    const idx = Math.floor((i * (points.length - 1)) / Math.max(max - 1, 1));
    out.push(points[idx]);
  }
  return out;
}

/**
 * Snaps a GPS path to roads via Roads API (REST). Falls back to null on failure / CORS.
 * @see https://developers.google.com/maps/documentation/roads/snap
 */
export async function snapPathToRoads(
  path: LatLngPoint[]
): Promise<LatLngPoint[] | null> {
  if (path.length < 2) return null;

  const sampled = samplePoints(path, MAX_POINTS_PER_REQUEST);
  const pathParam = sampled.map((p) => `${p.lat},${p.lng}`).join("|");

  const url = new URL("https://roads.googleapis.com/v1/snapToRoads");
  url.searchParams.set("path", pathParam);
  url.searchParams.set("interpolate", "true");
  url.searchParams.set("key", config.GOOGLE_MAPS_API_KEY);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = (await res.json()) as {
      snappedPoints?: Array<{ location: { latitude: number; longitude: number } }>;
    };
    if (!data.snappedPoints?.length) return null;
    return data.snappedPoints.map((sp) => ({
      lat: sp.location.latitude,
      lng: sp.location.longitude,
    }));
  } catch {
    return null;
  }
}
