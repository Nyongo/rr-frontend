import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TripLocation } from "@/services/tripLocationApi";
import { useGoogleMapsScript } from "@/hooks/useGoogleMapsScript";
import { snapPathToRoads, type LatLngPoint } from "@/services/googleRoadsApi";

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

interface TripLocationMapProps {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  locationHistory?: TripLocation[];
  className?: string;
}

// Validate and normalize coordinates
const validateCoordinates = (lat: number, lng: number): { lat: number; lng: number; valid: boolean } => {
  // Check if coordinates are valid numbers
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    console.error('Invalid coordinates:', { lat, lng });
    return { lat: 0, lng: 0, valid: false };
  }

  // Check if coordinates are within valid ranges
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    console.error('Coordinates out of range:', { lat, lng });
    return { lat: 0, lng: 0, valid: false };
  }

  // Check if coordinates might be swapped (common error)
  // If lat is > 90 or < -90, or lng is > 180 or < -180, they might be swapped
  // Also check if values look like they're in wrong order (e.g., lat > 90 but lng is reasonable)
  if ((Math.abs(lat) > 90 && Math.abs(lng) <= 90) || (Math.abs(lng) > 180 && Math.abs(lat) <= 90)) {
    console.warn('Coordinates might be swapped, attempting to fix:', { lat, lng });
    // Swap them
    return { lat: lng, lng: lat, valid: true };
  }

  return { lat, lng, valid: true };
};

const TripLocationMap = ({
  latitude,
  longitude,
  heading,
  speed,
  locationHistory = [],
  className = "",
}: TripLocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const streetViewInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const startMarkerRef = useRef<any>(null);
  const mainInfoWindowRef = useRef<any>(null);
  const startInfoWindowRef = useRef<any>(null);
  const { isLoaded: isGoogleMapsLoaded, error: scriptLoadError } =
    useGoogleMapsScript();
  const [isLoading, setIsLoading] = useState(true);
  const [showStreetView, setShowStreetView] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [startAddress, setStartAddress] = useState<string | null>(null);

  // Validate and normalize coordinates
  const validatedCoords = validateCoordinates(latitude, longitude);
  const validLat = validatedCoords.lat;
  const validLng = validatedCoords.lng;

  useEffect(() => {
    if (scriptLoadError) {
      setMapError(scriptLoadError);
      setIsLoading(false);
    }
  }, [scriptLoadError]);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!isGoogleMapsLoaded || !window.google?.maps || !mapRef.current) {
      return;
    }

    try {
      setIsLoading(true);
      setMapError(null);

      // Validate coordinates before initializing map
      if (!validatedCoords.valid) {
        setMapError(`Invalid coordinates: ${latitude}, ${longitude}`);
        setIsLoading(false);
        return;
      }

      // Initialize map with validated coordinates
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: validLat, lng: validLng },
        zoom: 8,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Add marker with validated coordinates
      const marker = new window.google.maps.Marker({
        position: { lat: validLat, lng: validLng },
        map: map,
        title: "Trip Location",
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          rotation: heading || 0,
        },
      });

      markerRef.current = marker;

      const buildMainInfoHtml = (address: string | null) => `
          <div style="padding: 8px; max-width: 280px;">
            <div style="font-weight: bold; margin-bottom: 4px;">Trip Location</div>
            ${
              address
                ? `<div style="font-size: 13px; color: #111; margin-bottom: 6px;">${address}</div>`
                : `<div style="font-size: 12px; color: #888;">Loading address…</div>`
            }
            <div style="font-size: 11px; color: #666;">
              ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
              ${speed !== undefined ? `<br>Speed: ${speed.toFixed(1)} km/h` : ""}
              ${heading !== undefined ? `<br>Heading: ${heading}°` : ""}
            </div>
          </div>
        `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: buildMainInfoHtml(null),
      });
      mainInfoWindowRef.current = infoWindow;

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: validLat, lng: validLng } },
        (results: { formatted_address?: string }[] | null, status: string) => {
          const addr =
            status === "OK" && results?.[0]?.formatted_address
              ? results[0].formatted_address
              : null;
          setCurrentAddress(addr);
          infoWindow.setContent(buildMainInfoHtml(addr));
        }
      );

      // Add start marker (first point) - done here to ensure map is ready
      if (locationHistory && locationHistory.length > 0 && !startMarkerRef.current) {
        const startLocation = locationHistory[0];
        const startMarker = new window.google.maps.Marker({
          position: { lat: startLocation.latitude, lng: startLocation.longitude },
          map: map,
          title: "Trip Start",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#34A853", // Google Maps green for start
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
          label: {
            text: "START",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: "bold",
          },
          zIndex: 10,
        });

        const buildStartInfoHtml = (address: string | null) => `
            <div style="padding: 8px; max-width: 280px;">
              <div style="font-weight: bold; margin-bottom: 4px; color: #34A853;">Trip Start</div>
              ${
                address
                  ? `<div style="font-size: 13px; color: #111; margin-bottom: 6px;">${address}</div>`
                  : `<div style="font-size: 12px; color: #888;">Loading address…</div>`
              }
              <div style="font-size: 11px; color: #666;">
                ${startLocation.latitude.toFixed(6)}, ${startLocation.longitude.toFixed(6)}
                <br>Time: ${new Date(startLocation.timestamp).toLocaleTimeString()}
              </div>
            </div>
          `;

        const startInfoWindow = new window.google.maps.InfoWindow({
          content: buildStartInfoHtml(null),
        });
        startInfoWindowRef.current = startInfoWindow;

        startMarker.addListener("click", () => {
          startInfoWindow.open(map, startMarker);
        });

        geocoder.geocode(
          {
            location: {
              lat: startLocation.latitude,
              lng: startLocation.longitude,
            },
          },
          (results: { formatted_address?: string }[] | null, status: string) => {
            const addr =
              status === "OK" && results?.[0]?.formatted_address
                ? results[0].formatted_address
                : null;
            setStartAddress(addr);
            startInfoWindow.setContent(buildStartInfoHtml(addr));
          }
        );

        startMarkerRef.current = startMarker;
      }

      // Draw route path if location history exists (roads-snapped when API allows)
      if (locationHistory && locationHistory.length > 0) {
        void drawRoutePath(map, locationHistory, latitude, longitude);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map");
      setIsLoading(false);
    }
  }, [isGoogleMapsLoaded, validLat, validLng]); // Re-initialize if coordinates change significantly

  // Initialize Street View
  useEffect(() => {
    if (
      !isGoogleMapsLoaded ||
      !window.google?.maps ||
      !streetViewRef.current ||
      !showStreetView
    ) {
      // Clean up Street View if hidden
      if (streetViewInstanceRef.current) {
        streetViewInstanceRef.current = null;
      }
      return;
    }

    try {
      // First check if Street View is available
      const streetViewService = new window.google.maps.StreetViewService();
      streetViewService.getPanorama(
        { location: { lat: latitude, lng: longitude }, radius: 50 },
        (data: any, status: string) => {
          if (status === window.google.maps.StreetViewStatus.OK) {
            // Street View is available, create panorama
            const panorama = new window.google.maps.StreetViewPanorama(
              streetViewRef.current,
              {
                position: { lat: latitude, lng: longitude },
                pov: {
                  heading: heading || data.location.pov.heading || 0,
                  pitch: 0,
                },
                zoom: 1,
              }
            );

            streetViewInstanceRef.current = panorama;
            setMapError(null);
          } else {
            // Street View not available
            setMapError("Street View imagery is not available at this location");
            streetViewInstanceRef.current = null;
          }
        }
      );
    } catch (error) {
      console.error("Error initializing Street View:", error);
      setMapError("Failed to load Street View");
    }
  }, [isGoogleMapsLoaded, showStreetView, latitude, longitude, heading]);

  // Recorded GPS path: snap to roads when possible (Roads API), else raw polyline
  const drawRoutePath = async (
    map: any,
    history: TripLocation[],
    currentLat: number,
    currentLng: number
  ) => {
    if (!window.google?.maps || !map) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    const allPoints: LatLngPoint[] = [];

    history.forEach((location) => {
      const validated = validateCoordinates(location.latitude, location.longitude);
      if (validated.valid) {
        allPoints.push({ lat: validated.lat, lng: validated.lng });
      } else {
        console.warn("Skipping invalid location in history:", location);
      }
    });

    const lastHistoryPoint = history[history.length - 1];
    if (
      !lastHistoryPoint ||
      Math.abs(lastHistoryPoint.latitude - currentLat) > 0.0001 ||
      Math.abs(lastHistoryPoint.longitude - currentLng) > 0.0001
    ) {
      const validated = validateCoordinates(currentLat, currentLng);
      if (validated.valid) {
        allPoints.push({ lat: validated.lat, lng: validated.lng });
      }
    }

    if (allPoints.length < 2) return;

    const snapped = await snapPathToRoads(allPoints);
    const pathToDraw =
      snapped && snapped.length >= 2 ? snapped : allPoints;

    drawSmoothPolyline(map, pathToDraw, true);
  };

  // Draw smooth polyline with Google Maps-like styling
  const drawSmoothPolyline = (
    map: any,
    points: LatLngPoint[],
    shouldFitBounds: boolean = true
  ) => {
    const polyline = new window.google.maps.Polyline({
      path: points,
      geodesic: true,
      strokeColor: "#4285F4", // Google Maps blue color
      strokeOpacity: 0.9,
      strokeWeight: 5, // Thicker line like Google Maps navigation
      zIndex: 1,
      map: map,
    });

    polylineRef.current = polyline;

    // Only fit bounds on initial draw, not on updates
    if (shouldFitBounds && points.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      points.forEach((point) => {
        bounds.extend(point);
      });
      map.fitBounds(bounds, { padding: 50 });
    }
  };

  // Smooth marker movement and map panning (like Google Maps/Uber)
  // Google Maps panTo() is already smooth, so we just use it directly
  useEffect(() => {
    if (!markerRef.current || !mapInstanceRef.current) return;

    // Validate coordinates on each update
    const validated = validateCoordinates(latitude, longitude);
    if (!validated.valid) {
      console.error('Invalid coordinates received:', { 
        latitude, 
        longitude, 
        latType: typeof latitude, 
        lngType: typeof longitude 
      });
      return;
    }

    // Log coordinate updates for debugging (only in dev mode)
    if (import.meta.env.DEV) {
      console.log('📍 Location update:', {
        received: { lat: latitude, lng: longitude },
        validated: { lat: validated.lat, lng: validated.lng },
        heading,
        speed
      });
    }

    const newPosition = { lat: validated.lat, lng: validated.lng };
    
    // Update marker position (Google Maps handles smooth transitions internally)
    markerRef.current.setPosition(newPosition);
    
    // Smoothly pan map to follow marker (panTo is smooth by default in Google Maps)
    // This creates the smooth following effect like Uber/Google Maps navigation
    mapInstanceRef.current.panTo(newPosition);

    // Update marker rotation if heading is provided
    if (heading !== undefined) {
      markerRef.current.setIcon({
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 6,
        fillColor: "#ef4444",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        rotation: heading,
      });
    }

    // Update Street View position if it's visible
    if (streetViewInstanceRef.current && showStreetView) {
      streetViewInstanceRef.current.setPosition(newPosition);
      if (heading !== undefined) {
        streetViewInstanceRef.current.setPov({
          heading: heading,
          pitch: 0,
        });
      }
    }
  }, [validLat, validLng, heading, showStreetView]);

  // Extend route path smoothly as new points arrive (like Google Maps navigation)
  const lastHistoryLengthRef = useRef<number>(0);
  useEffect(() => {
    if (!mapInstanceRef.current || !locationHistory || locationHistory.length === 0) {
      lastHistoryLengthRef.current = 0;
      return;
    }
    
    const currentLength = locationHistory.length;
    
    if (lastHistoryLengthRef.current === 0) {
      // Initial route draw
      void drawRoutePath(mapInstanceRef.current, locationHistory, latitude, longitude);
      lastHistoryLengthRef.current = currentLength;
    } else if (currentLength > lastHistoryLengthRef.current) {
      // New points added - extend the polyline smoothly instead of redrawing
      if (polylineRef.current) {
        const currentPath = polylineRef.current.getPath();
        const newPoints: Array<{ lat: number; lng: number }> = [];
        
        // Get existing path points
        currentPath.forEach((point: any) => {
          newPoints.push({ lat: point.lat(), lng: point.lng() });
        });
        
        // Add new points from history with validation
        const newHistoryPoints = locationHistory.slice(lastHistoryLengthRef.current);
        newHistoryPoints.forEach((location) => {
          const validated = validateCoordinates(location.latitude, location.longitude);
          if (validated.valid) {
            newPoints.push({ lat: validated.lat, lng: validated.lng });
          } else {
            console.warn('Skipping invalid location:', location);
          }
        });
        
        // Add current location if different from last point
        const lastPoint = newPoints[newPoints.length - 1];
        const validatedCurrent = validateCoordinates(latitude, longitude);
        if (validatedCurrent.valid && (!lastPoint || 
            Math.abs(lastPoint.lat - validatedCurrent.lat) > 0.0001 || 
            Math.abs(lastPoint.lng - validatedCurrent.lng) > 0.0001)) {
          newPoints.push({ lat: validatedCurrent.lat, lng: validatedCurrent.lng });
        }
        
        // Update polyline path smoothly
        polylineRef.current.setPath(newPoints);
        
        // Don't fit bounds on every update - let the smooth pan handle it
        // This prevents the map from jumping around
      } else {
        // No existing polyline, draw full route
        void drawRoutePath(mapInstanceRef.current, locationHistory, latitude, longitude);
      }
      
      lastHistoryLengthRef.current = currentLength;
    }
  }, [locationHistory?.length, latitude, longitude]);

  if (mapError && !isGoogleMapsLoaded) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">{mapError}</p>
            <p className="text-sm text-gray-500 mt-2">
              Received coordinates: {latitude?.toFixed(6) || 'N/A'}, {longitude?.toFixed(6) || 'N/A'}
            </p>
            {validatedCoords.valid && (
              <p className="text-sm text-green-600 mt-1">
                Validated coordinates: {validLat.toFixed(6)}, {validLng.toFixed(6)}
              </p>
            )}
            {!validatedCoords.valid && (
              <p className="text-sm text-red-600 mt-1">
                ⚠️ Coordinates are invalid. Please check the data source.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show coordinate info in dev mode
  const showDebugInfo = import.meta.env.DEV && validatedCoords.valid;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Debug Info (dev mode only) */}
      {showDebugInfo && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <p>📍 Lat: {validLat.toFixed(6)}, Lng: {validLng.toFixed(6)}</p>
          {heading !== undefined && <p>🧭 Heading: {heading}°</p>}
          {speed !== undefined && <p>⚡ Speed: {speed.toFixed(1)} km/h</p>}
        </div>
      )}

      {/* Map View */}
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-64 rounded-lg border border-gray-200 overflow-hidden bg-gray-100"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        )}
      </div>

      {/* Street View Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowStreetView(!showStreetView)}
        className="w-full"
      >
        {showStreetView ? (
          <>
            <Minimize2 className="w-4 h-4 mr-2" />
            Hide Street View
          </>
        ) : (
          <>
            <Maximize2 className="w-4 h-4 mr-2" />
            Show Street View
          </>
        )}
      </Button>

      {/* Street View */}
      {showStreetView && (
        <div className="relative">
          <div
            ref={streetViewRef}
            className="w-full h-64 rounded-lg border border-gray-200 overflow-hidden bg-gray-100"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          )}
          {mapError && mapError.includes("Street View") && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
              <div className="text-center p-4">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{mapError}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Address + coordinates */}
      <div className="text-xs text-gray-600 text-center space-y-1">
        {currentAddress && (
          <p className="font-medium text-gray-800 leading-snug">{currentAddress}</p>
        )}
        {locationHistory.length > 0 && startAddress && (
          <p className="text-gray-500">
            <span className="font-medium text-green-700">Start: </span>
            {startAddress}
          </p>
        )}
        <p>
          Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </p>
      </div>
    </div>
  );
};

export default TripLocationMap;

