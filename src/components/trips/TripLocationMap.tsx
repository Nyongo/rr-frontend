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

        const startInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px; color: #34A853;">Trip Start</div>
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
  }, [isGoogleMapsLoaded]); // Only initialize once when maps loads

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

  // Function to draw route path using Directions Service for road-following route
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
      polylineRef.current = null;
    }

    // Create path from history + current location
    const allPoints: Array<{ lat: number; lng: number }> = [];
    
    // Add all historical locations
    history.forEach((location) => {
      allPoints.push({ lat: location.latitude, lng: location.longitude });
    });

    // Add current location if it's different from the last history point
    const lastHistoryPoint = history[history.length - 1];
    if (
      !lastHistoryPoint ||
      lastHistoryPoint.latitude !== currentLat ||
      lastHistoryPoint.longitude !== currentLng
    ) {
      allPoints.push({ lat: currentLat, lng: currentLng });
    }

    // Only draw if we have at least 2 points
    if (allPoints.length < 2) return;

    // Always use polyline to show ACTUAL path taken (better for tracking/auditing)
    // Since GPS points are logged every ~2 minutes, we have enough points for a smooth path
    // This shows where the bus actually went, not the optimal route
    drawSmoothPolyline(map, allPoints, true); // Fit bounds on initial draw
  };

  // Draw smooth polyline with Google Maps-like styling
  const drawSmoothPolyline = (
    map: any,
    points: Array<{ lat: number; lng: number }>,
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

    const newPosition = { lat: latitude, lng: longitude };
    
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
  }, [latitude, longitude, heading, showStreetView]);

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
      drawRoutePath(mapInstanceRef.current, locationHistory, latitude, longitude);
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
        
        // Add new points from history
        const newHistoryPoints = locationHistory.slice(lastHistoryLengthRef.current);
        newHistoryPoints.forEach((location) => {
          newPoints.push({ lat: location.latitude, lng: location.longitude });
        });
        
        // Add current location if different from last point
        const lastPoint = newPoints[newPoints.length - 1];
        if (!lastPoint || 
            Math.abs(lastPoint.lat - latitude) > 0.0001 || 
            Math.abs(lastPoint.lng - longitude) > 0.0001) {
          newPoints.push({ lat: latitude, lng: longitude });
        }
        
        // Update polyline path smoothly
        polylineRef.current.setPath(newPoints);
        
        // Don't fit bounds on every update - let the smooth pan handle it
        // This prevents the map from jumping around
      } else {
        // No existing polyline, draw full route
        drawRoutePath(mapInstanceRef.current, locationHistory, latitude, longitude);
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

