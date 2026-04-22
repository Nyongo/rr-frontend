import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Minus, MapPin, Loader2 } from "lucide-react";
import { useGoogleMapsScript } from "@/hooks/useGoogleMapsScript";
import {
  DEFAULT_MAP_SPAN_KM,
  fitMapToSquareSpanKm,
} from "@/lib/mapViewport";

interface GeofenceMapProps {
  center: { lat: number; lng: number };
  radius: number;
  onGeofenceChange: (center: { lat: number; lng: number }, radius: number) => void;
}

/**
 * Google Map + Places search for zone center; draggable marker and circle show geofence.
 */
const GeofenceMap = ({
  center,
  radius,
  onGeofenceChange,
}: GeofenceMapProps) => {
  const { isLoaded, error } = useGoogleMapsScript();
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const circleRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const radiusRef = useRef(radius);
  const onChangeRef = useRef(onGeofenceChange);

  radiusRef.current = radius;
  onChangeRef.current = onGeofenceChange;

  // Create map, circle, marker once
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      mapTypeId: window.google.maps.MapTypeId.HYBRID,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });
    mapInstanceRef.current = map;
    fitMapToSquareSpanKm(map, center.lat, center.lng, DEFAULT_MAP_SPAN_KM, 32);

    const circle = new window.google.maps.Circle({
      center,
      radius,
      map,
      strokeColor: "#3b82f6",
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: "#3b82f6",
      fillOpacity: 0.12,
      clickable: false,
    });
    circleRef.current = circle;

    const marker = new window.google.maps.Marker({
      position: center,
      map,
      draggable: true,
      title: "Geofence center",
    });
    markerRef.current = marker;

    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      if (!pos) return;
      const lat = pos.lat();
      const lng = pos.lng();
      circle.setCenter({ lat, lng });
      onChangeRef.current({ lat, lng }, radiusRef.current);
    });

    map.addListener("click", (e: { latLng?: { lat: () => number; lng: () => number } | null }) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      marker.setPosition({ lat, lng });
      circle.setCenter({ lat, lng });
      onChangeRef.current({ lat, lng }, radiusRef.current);
    });

    return () => {
      marker.setMap(null);
      circle.setMap(null);
      mapInstanceRef.current = null;
      circleRef.current = null;
      markerRef.current = null;
    };
  }, [isLoaded]);

  // Sync from parent (e.g. after Places search or dialog reset)
  useEffect(() => {
    if (!circleRef.current || !markerRef.current || !mapInstanceRef.current)
      return;
    circleRef.current.setCenter(center);
    circleRef.current.setRadius(radius);
    markerRef.current.setPosition(center);
    fitMapToSquareSpanKm(
      mapInstanceRef.current,
      center.lat,
      center.lng,
      DEFAULT_MAP_SPAN_KM,
      32
    );
  }, [center.lat, center.lng, radius]);

  // Places Autocomplete (search by name)
  useEffect(() => {
    if (!isLoaded || !searchInputRef.current || !window.google.maps?.places)
      return;

    const ac = new window.google.maps.places.Autocomplete(
      searchInputRef.current,
      { fields: ["geometry", "formatted_address", "name"] }
    );

    const listener = ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      const loc = place.geometry?.location;
      if (!loc) return;
      const lat = loc.lat();
      const lng = loc.lng();
      if (circleRef.current && markerRef.current && mapInstanceRef.current) {
        circleRef.current.setCenter({ lat, lng });
        markerRef.current.setPosition({ lat, lng });
        fitMapToSquareSpanKm(
          mapInstanceRef.current,
          lat,
          lng,
          DEFAULT_MAP_SPAN_KM,
          32
        );
      }
      onChangeRef.current({ lat, lng }, radiusRef.current);
    });

    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [isLoaded]);

  const handleZoomIn = () => {
    const z = mapInstanceRef.current?.getZoom() ?? 14;
    mapInstanceRef.current?.setZoom(Math.min(z + 1, 20));
  };

  const handleZoomOut = () => {
    const z = mapInstanceRef.current?.getZoom() ?? 14;
    mapInstanceRef.current?.setZoom(Math.max(z - 1, 3));
  };

  if (error) {
    return (
      <p className="text-sm text-red-600 p-4">
        Map could not load ({error}). Check VITE_GOOGLE_MAPS_API_KEY and enabled APIs.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
        <Input
          ref={searchInputRef}
          placeholder="Search for a place (Places API)…"
          className="pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          type="text"
          autoComplete="off"
        />
      </div>

      <div className="relative rounded-lg border border-gray-300 overflow-hidden">
        <div
          ref={mapRef}
          className="w-full min-h-[360px] h-[45vh] max-h-[640px] bg-gray-100"
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90 z-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleZoomIn}
            className="bg-white shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleZoomOut}
            className="bg-white shadow-sm"
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-1.5 rounded text-xs text-gray-700 flex items-center gap-1 max-w-[85%] shadow z-10">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-blue-600" />
          <span className="truncate font-mono">
            {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Search to jump to an address, or click / drag the pin to set the geofence center.
      </p>
    </div>
  );
};

export default GeofenceMap;
