import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TripLocation } from "@/services/tripLocationApi";
import { config } from "@/lib/config";

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
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showStreetView, setShowStreetView] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Load Google Maps API
  useEffect(() => {
    // Check if already loaded
    if (window.google?.maps) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          setIsGoogleMapsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // Create new script
    const script = document.createElement("script");
    const apiKey = config.GOOGLE_MAPS_API_KEY;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google?.maps) {
        setIsGoogleMapsLoaded(true);
      }
    };

    script.onerror = () => {
      setMapError("Failed to load Google Maps");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts before it loads
      if (!window.google?.maps) {
        const scriptToRemove = document.querySelector(
          'script[src*="maps.googleapis.com"]'
        );
        if (scriptToRemove && scriptToRemove === script) {
          scriptToRemove.remove();
        }
      }
    };
  }, []);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!isGoogleMapsLoaded || !window.google?.maps || !mapRef.current) {
      return;
    }

    try {
      setIsLoading(true);
      setMapError(null);

      // Initialize map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Add marker
      const marker = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
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

      // Add info window with location details
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">Trip Location</div>
            <div style="font-size: 12px; color: #666;">
              ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
              ${speed !== undefined ? `<br>Speed: ${speed.toFixed(1)} km/h` : ""}
              ${heading !== undefined ? `<br>Heading: ${heading}°` : ""}
            </div>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      // Draw route path if location history exists
      if (locationHistory && locationHistory.length > 0) {
        drawRoutePath(map, locationHistory, latitude, longitude);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map");
      setIsLoading(false);
    }
  }, [isGoogleMapsLoaded, latitude, longitude, heading, speed, locationHistory]);

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

  // Function to draw route path
  const drawRoutePath = (
    map: any,
    history: TripLocation[],
    currentLat: number,
    currentLng: number
  ) => {
    if (!window.google?.maps || !map) return;

    // Remove existing polyline if it exists
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    // Create path from history + current location
    const path: Array<{ lat: number; lng: number }> = [];
    
    // Add all historical locations
    history.forEach((location) => {
      path.push({ lat: location.latitude, lng: location.longitude });
    });

    // Add current location if it's different from the last history point
    const lastHistoryPoint = history[history.length - 1];
    if (
      !lastHistoryPoint ||
      lastHistoryPoint.latitude !== currentLat ||
      lastHistoryPoint.longitude !== currentLng
    ) {
      path.push({ lat: currentLat, lng: currentLng });
    }

    // Only draw if we have at least 2 points
    if (path.length < 2) return;

    // Create polyline
    const polyline = new window.google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: "#3b82f6", // Blue color
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: map,
    });

    polylineRef.current = polyline;

    // Add start marker (first point)
    if (history.length > 0 && !startMarkerRef.current) {
      const startLocation = history[0];
      const startMarker = new window.google.maps.Marker({
        position: { lat: startLocation.latitude, lng: startLocation.longitude },
        map: map,
        title: "Trip Start",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#10b981", // Green for start
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        label: {
          text: "S",
          color: "#ffffff",
          fontSize: "12px",
          fontWeight: "bold",
        },
      });

      const startInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px; color: #10b981;">Trip Start</div>
            <div style="font-size: 12px; color: #666;">
              ${startLocation.latitude.toFixed(6)}, ${startLocation.longitude.toFixed(6)}
              <br>Time: ${new Date(startLocation.timestamp).toLocaleTimeString()}
            </div>
          </div>
        `,
      });

      startMarker.addListener("click", () => {
        startInfoWindow.open(map, startMarker);
      });

      startMarkerRef.current = startMarker;
    }

    // Fit map bounds to show entire route
    if (path.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      path.forEach((point) => {
        bounds.extend(point);
      });
      map.fitBounds(bounds);

      // Add some padding
      const padding = 50;
      map.fitBounds(bounds, {
        top: padding,
        right: padding,
        bottom: padding,
        left: padding,
      });
    }
  };

  // Update marker position and route when location changes
  useEffect(() => {
    if (!markerRef.current || !mapInstanceRef.current) return;

    const newPosition = { lat: latitude, lng: longitude };
    markerRef.current.setPosition(newPosition);
    
    // Only auto-center if we don't have a route path (to avoid jumping)
    if (!polylineRef.current) {
      mapInstanceRef.current.setCenter(newPosition);
    }

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

    // Update route path if location history exists
    if (locationHistory && locationHistory.length > 0 && mapInstanceRef.current) {
      drawRoutePath(mapInstanceRef.current, locationHistory, latitude, longitude);
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
  }, [latitude, longitude, heading, showStreetView, locationHistory]);

  if (mapError && !isGoogleMapsLoaded) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">{mapError}</p>
            <p className="text-sm text-gray-500 mt-2">
              Showing coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
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

      {/* Coordinates Display */}
      <div className="text-xs text-gray-600 text-center">
        Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
      </div>
    </div>
  );
};

export default TripLocationMap;

