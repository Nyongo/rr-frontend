import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Clock,
  Gauge,
  Compass,
  Activity,
  RefreshCw,
  History,
  Wifi,
  WifiOff,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useTripLocationWebSocket } from "@/hooks/useTripLocationWebSocket";
import {
  getTripCurrentLocation,
  getTripLocationHistory,
  TripLocation,
} from "@/services/tripLocationApi";
import { toast } from "@/hooks/use-toast";
import TripLocationMap from "./TripLocationMap";

interface TripLocationTrackerProps {
  tripId: string;
  tripStatus: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

const TripLocationTracker = ({
  tripId,
  tripStatus,
}: TripLocationTrackerProps) => {
  const [locationHistory, setLocationHistory] = useState<TripLocation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isTracking, setIsTracking] = useState(
    tripStatus === "IN_PROGRESS"
  );

  const {
    currentLocation,
    isConnected,
    error,
    reconnect,
    connectionMode,
  } = useTripLocationWebSocket({
    tripId,
    enabled: isTracking && tripStatus === "IN_PROGRESS",
  });

  // Fetch initial location and history
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch current location
        const currentLocationResponse = await getTripCurrentLocation(tripId);
        if (currentLocationResponse.data) {
          // The WebSocket will update this, but we set initial state
        }

        // Always load history to show route on map
        await loadHistory();
      } catch (err) {
        console.error("Error fetching initial location data:", err);
        // Don't show error toast for initial load - it's expected if trip hasn't started
      }
    };

    if (tripId) {
      fetchInitialData();
    }
  }, [tripId]);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await getTripLocationHistory(tripId);
      setLocationHistory(response.data || []);
    } catch (err) {
      console.error("Error loading location history:", err);
      // Don't show toast for initial load - it's expected if trip hasn't started
      if (showHistory) {
        toast({
          title: "Error",
          description: "Failed to load location history",
          variant: "destructive",
        });
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleToggleHistory = () => {
    if (!showHistory && locationHistory.length === 0) {
      loadHistory();
    }
    setShowHistory(!showHistory);
  };

  // Update location history when new location arrives via WebSocket
  useEffect(() => {
    if (currentLocation) {
      // Check if this location is already in history (by ID or timestamp)
      const isNewLocation = !locationHistory.some(
        (loc) => loc.id === currentLocation.id || loc.timestamp === currentLocation.timestamp
      );

      if (isNewLocation) {
        // Add new location to history (keep it sorted by timestamp)
        setLocationHistory((prev) => {
          const updated = [...prev, currentLocation];
          // Sort by timestamp to maintain chronological order
          return updated.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });
      }
    }
  }, [currentLocation]);

  const displayLocation = currentLocation || locationHistory[locationHistory.length - 1];

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      {isTracking && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                {connectionMode === "websocket" ? (
                  <Wifi className="w-4 h-4 text-green-600" />
                ) : (
                  <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                )}
                <span className="text-sm text-gray-700">
                  {connectionMode === "websocket"
                    ? "Live tracking active"
                    : "Polling for updates"}
                </span>
                <Badge
                  className={
                    connectionMode === "websocket"
                      ? "bg-green-100 text-green-800 text-xs"
                      : "bg-blue-100 text-blue-800 text-xs"
                  }
                >
                  {connectionMode === "websocket" ? "WebSocket" : "Polling"}
                </Badge>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-700">Not connected</span>
                <Badge className="bg-red-100 text-red-800 text-xs">
                  Disconnected
                </Badge>
              </>
            )}
          </div>
          {!isConnected && error && (
            <Button
              variant="outline"
              size="sm"
              onClick={reconnect}
              className="h-7 text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Reconnect
            </Button>
          )}
        </div>
      )}

      {/* Current Location Display */}
      {displayLocation ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {currentLocation ? "Current Location" : "Last Known Location"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Maps with Street View */}
            <TripLocationMap
              latitude={displayLocation.latitude}
              longitude={displayLocation.longitude}
              heading={displayLocation.heading}
              speed={displayLocation.speed}
              locationHistory={locationHistory}
            />

            {/* Location Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-500">Timestamp</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {format(parseISO(displayLocation.timestamp), "h:mm:ss a")}
                </p>
                <p className="text-xs text-gray-600">
                  {format(parseISO(displayLocation.timestamp), "MMM dd, yyyy")}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-500">Speed</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {displayLocation.speed.toFixed(1)} km/h
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Compass className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-500">Heading</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {displayLocation.heading}°
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-500">Accuracy</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {displayLocation.accuracy.toFixed(1)} m
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                {tripStatus === "IN_PROGRESS"
                  ? "Waiting for location data..."
                  : "Location tracking will start when the trip begins"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location History */}
      {displayLocation && (
        <div>
          <Button
            variant="outline"
            onClick={handleToggleHistory}
            className="w-full"
            disabled={loadingHistory}
          >
            <History className="w-4 h-4 mr-2" />
            {showHistory ? "Hide" : "Show"} Location History
            {loadingHistory && (
              <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
            )}
          </Button>

          {showHistory && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Location History</CardTitle>
              </CardHeader>
              <CardContent>
                {locationHistory.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {locationHistory
                      .slice()
                      .reverse()
                      .map((location) => (
                        <div
                          key={location.id}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-800">
                                {format(parseISO(location.timestamp), "h:mm:ss a")}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {location.speed.toFixed(1)} km/h
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Coordinates: </span>
                              <span className="font-mono text-gray-700">
                                {location.latitude.toFixed(6)},{" "}
                                {location.longitude.toFixed(6)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Heading: </span>
                              <span className="text-gray-700">
                                {location.heading}°
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 text-center py-4">
                    No location history available
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default TripLocationTracker;

