import { useEffect, useRef } from "react";
import { Loader2, Navigation } from "lucide-react";
import { useGoogleMapsScript } from "@/hooks/useGoogleMapsScript";

interface TripRoutePreviewMapProps {
  waypoints: { lat: number; lng: number }[];
  className?: string;
}

/**
 * Driving directions preview between ordered stops (Directions API via JS SDK).
 */
const TripRoutePreviewMap = ({
  waypoints,
  className = "",
}: TripRoutePreviewMapProps) => {
  const { isLoaded, error } = useGoogleMapsScript();
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rendererRef = useRef<any>(null);

  const waypointsKey = JSON.stringify(waypoints);

  useEffect(() => {
    if (!isLoaded || !window.google?.maps || !mapRef.current) return;
    if (waypoints.length < 2) return;

    const pts = waypoints.map((p) => ({ lat: p.lat, lng: p.lng }));

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: pts[0],
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
    } else {
      mapInstanceRef.current.setCenter(pts[0]);
    }

    const map = mapInstanceRef.current;

    if (!rendererRef.current) {
      rendererRef.current = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: false,
      });
    }

    const renderer = rendererRef.current;
    const directionsService = new window.google.maps.DirectionsService();
    const origin = pts[0];
    const destination = pts[pts.length - 1];
    const middle =
      pts.length > 2
        ? pts.slice(1, -1).map((location) => ({
            location,
            stopover: true,
          }))
        : [];

    directionsService.route(
      {
        origin,
        destination,
        waypoints: middle,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          renderer.setDirections(result);
        }
      }
    );
  }, [isLoaded, waypointsKey, waypoints.length]);

  if (waypoints.length < 2) {
    return null;
  }

  if (error) {
    return (
      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
        Could not load the map ({error}). Check your API key and network.
      </p>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
        <Navigation className="w-4 h-4 text-blue-600" />
        Planned route (driving directions preview)
      </div>
      <div className="relative w-full h-56 sm:h-64 rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
        <div ref={mapRef} className="w-full h-full" />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Route follows roads between stops. Actual trip path may differ.
      </p>
    </div>
  );
};

export default TripRoutePreviewMap;
