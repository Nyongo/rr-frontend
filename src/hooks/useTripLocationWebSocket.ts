import { useEffect, useRef, useState, useCallback } from "react";
import { TripLocation, getTripCurrentLocation } from "@/services/tripLocationApi";
import { config } from "@/lib/config";

interface UseTripLocationWebSocketOptions {
  tripId: string | null;
  enabled?: boolean;
  onLocationUpdate?: (location: TripLocation) => void;
  usePolling?: boolean; // Force polling mode instead of WebSocket
  pollingInterval?: number; // Polling interval in milliseconds (default: 5000)
}

interface UseTripLocationWebSocketReturn {
  currentLocation: TripLocation | null;
  isConnected: boolean;
  error: Error | null;
  reconnect: () => void;
  connectionMode: "websocket" | "polling" | "none";
}

/**
 * Hook for real-time trip location tracking
 * 
 * Supports both WebSocket and polling modes:
 * - WebSocket: Connects using VITE_API_BASE_URL + /academic-suite from config (converts http to ws, https to wss)
 * - Polling: Falls back to polling REST endpoint if WebSocket fails
 * 
 * Automatically falls back to polling if WebSocket connection fails.
 */
export const useTripLocationWebSocket = ({
  tripId,
  enabled = true,
  onLocationUpdate,
  usePolling = false,
  pollingInterval = 5000, // 5 seconds
}: UseTripLocationWebSocketOptions): UseTripLocationWebSocketReturn => {
  const [currentLocation, setCurrentLocation] = useState<TripLocation | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [connectionMode, setConnectionMode] = useState<"websocket" | "polling" | "none">("none");
  const wsRef = useRef<WebSocket | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 3; // Reduced attempts before fallback
  const reconnectDelay = 2000; // 2 seconds
  const lastLocationIdRef = useRef<number | null>(null);

  // Polling function
  const pollLocation = useCallback(async () => {
    if (!tripId || !enabled) {
      return;
    }

    try {
      const response = await getTripCurrentLocation(tripId);
      if (response.success && response.data) {
        const location = response.data;
        
        // Only update if location has changed (different ID or timestamp)
        if (
          !lastLocationIdRef.current ||
          lastLocationIdRef.current !== location.id ||
          !currentLocation ||
          currentLocation.timestamp !== location.timestamp
        ) {
          lastLocationIdRef.current = location.id;
          setCurrentLocation(location);
          onLocationUpdate?.(location);
          setError(null);
        }
      }
    } catch (err) {
      console.error("Error polling location:", err);
      // Don't set error for polling failures - just log them
      // The connection is still "active" in polling mode
    }
  }, [tripId, enabled, onLocationUpdate, currentLocation]);

  // Start polling
  const startPolling = useCallback(() => {
    if (!tripId || !enabled) {
      return;
    }

    // Clear any existing polling interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Fetch immediately
    pollLocation();

    // Then poll at interval
    pollingIntervalRef.current = setInterval(() => {
      pollLocation();
    }, pollingInterval);

    setConnectionMode("polling");
    setIsConnected(true);
    setError(null);
    console.log(`Started polling for trip ${tripId} (interval: ${pollingInterval}ms)`);
  }, [tripId, enabled, pollingInterval, pollLocation]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setConnectionMode("none");
    setIsConnected(false);
  }, []);

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (!tripId || !enabled) {
      return;
    }

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      // Convert HTTP URL to WebSocket URL
      const academicSuiteUrl = `${config.API_BASE_URL}/academic-suite`;
      const baseUrl = academicSuiteUrl.replace(/^https?:\/\//, ""); // Remove http:// or https://
      const protocol = academicSuiteUrl.startsWith("https") ? "wss" : "ws";
      const wsUrl = `${protocol}://${baseUrl}/trips/${tripId}/location`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`WebSocket connected for trip ${tripId}`);
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        setConnectionMode("websocket");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle different response formats
          let location: TripLocation;
          if (data.success && data.data) {
            location = data.data;
          } else if (data.id && data.tripId) {
            // Direct location object
            location = data;
          } else {
            console.warn("Unexpected WebSocket message format:", data);
            return;
          }

          lastLocationIdRef.current = location.id;
          setCurrentLocation(location);
          onLocationUpdate?.(location);
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to parse location data")
          );
        }
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        // Don't set error immediately - wait for onclose
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setIsConnected(false);
        setConnectionMode("none");

        // If WebSocket fails, fall back to polling
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `WebSocket failed. Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, reconnectDelay);
        } else {
          // Max attempts reached, fall back to polling
          console.log("WebSocket connection failed. Falling back to polling mode.");
          setError(null); // Clear error since we're switching to polling
          startPolling();
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error("Error creating WebSocket:", err);
      // Fall back to polling on error
      console.log("WebSocket creation failed. Falling back to polling mode.");
      startPolling();
    }
  }, [tripId, enabled, onLocationUpdate, startPolling]);

  const connect = useCallback(() => {
    if (usePolling) {
      startPolling();
    } else {
      connectWebSocket();
    }
  }, [usePolling, startPolling, connectWebSocket]);

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    if (connectionMode === "polling") {
      startPolling();
    } else {
      connectWebSocket();
    }
  }, [connectionMode, startPolling, connectWebSocket]);

  useEffect(() => {
    if (tripId && enabled) {
      connect();
    } else {
      // Close connection if tripId is null or disabled
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      stopPolling();
      setIsConnected(false);
      setCurrentLocation(null);
      setConnectionMode("none");
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      stopPolling();
    };
  }, [tripId, enabled, connect, stopPolling]);

  return {
    currentLocation,
    isConnected,
    error,
    reconnect,
    connectionMode,
  };
};

