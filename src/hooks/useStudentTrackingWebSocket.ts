import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "@/lib/config";
import { TrackingLocation } from "@/services/tripsApi";

interface StudentTrackingSubscriptionData {
  trackingToken: string;
  student: {
    id: string;
    name: string;
    admissionNumber: string;
  };
  tripId: string;
  pickupStatus: "NOT_PICKED_UP" | "PICKED_UP";
  dropoffStatus: "NOT_DROPPED_OFF" | "DROPPED_OFF";
  currentLocation: TrackingLocation | null;
  message: string;
}

interface StudentLocationUpdate {
  trackingToken: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed: number;
  heading: number;
  accuracy: number;
}

interface UseStudentTrackingWebSocketOptions {
  trackingToken: string | null;
  enabled?: boolean;
  onLocationUpdate?: (location: StudentLocationUpdate) => void;
  onSubscriptionConfirmed?: (data: StudentTrackingSubscriptionData) => void;
}

interface UseStudentTrackingWebSocketReturn {
  currentLocation: TrackingLocation | null;
  isConnected: boolean;
  isSubscribed: boolean;
  error: Error | null;
  reconnect: () => void;
  subscriptionData: StudentTrackingSubscriptionData | null;
}

/**
 * Hook for real-time student tracking via Socket.IO
 * 
 * Connects to the /school-trip-tracking namespace and subscribes to
 * location updates for a specific tracking token.
 */
export const useStudentTrackingWebSocket = ({
  trackingToken,
  enabled = true,
  onLocationUpdate,
  onSubscriptionConfirmed,
}: UseStudentTrackingWebSocketOptions): UseStudentTrackingWebSocketReturn => {
  const [currentLocation, setCurrentLocation] = useState<TrackingLocation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<StudentTrackingSubscriptionData | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 2000; // 2 seconds

  // Convert API URL to WebSocket URL
  const getWebSocketUrl = useCallback(() => {
    const baseUrl = config.API_BASE_URL.replace(/^https?:\/\//, ""); // Remove http:// or https://
    const protocol = config.API_BASE_URL.startsWith("https") ? "wss" : "ws";
    return `${protocol}://${baseUrl}`;
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!trackingToken || !enabled) {
      return;
    }

    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    try {
      const wsUrl = getWebSocketUrl();
      console.log(`Connecting to tracking WebSocket: ${wsUrl}/school-trip-tracking`);

      const socket = io(`${wsUrl}/school-trip-tracking`, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: reconnectDelay,
      });

      socket.on("connect", () => {
        console.log("Connected to tracking server");
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;

        // Subscribe to student tracking
        if (trackingToken) {
          console.log(`Subscribing to tracking for token: ${trackingToken}`);
          socket.emit("subscribe-student-tracking", { trackingToken });
        }
      });

      socket.on("subscribed-student-tracking", (data: StudentTrackingSubscriptionData) => {
        console.log("Subscribed to student tracking:", data.message);
        setIsSubscribed(true);
        setSubscriptionData(data);
        
        // Set initial location if available
        if (data.currentLocation) {
          setCurrentLocation(data.currentLocation);
        }

        onSubscriptionConfirmed?.(data);
      });

      socket.on("student-location-update", (location: StudentLocationUpdate) => {
        console.log("Received location update:", location);

        // Convert to TrackingLocation format
        const trackingLocation: TrackingLocation = {
          id: 0, // ID may not be provided in update
          tripId: subscriptionData?.tripId || "",
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: location.timestamp,
          speed: location.speed,
          heading: location.heading,
          accuracy: location.accuracy,
        };

        setCurrentLocation(trackingLocation);
        onLocationUpdate?.(location);
      });

      socket.on("error", (errorData: { message: string }) => {
        console.error("Tracking error:", errorData.message);
        setError(new Error(errorData.message));
      });

      socket.on("disconnect", (reason: string) => {
        console.log("Disconnected from tracking server:", reason);
        setIsConnected(false);
        setIsSubscribed(false);

        // Attempt to reconnect if not a manual disconnect
        if (reason !== "io client disconnect" && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        }
      });

      socket.on("connect_error", (err: Error) => {
        console.error("Connection error:", err);
        setError(err);
        setIsConnected(false);
      });

      socketRef.current = socket;
    } catch (err) {
      console.error("Error creating WebSocket connection:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to create WebSocket connection")
      );
    }
  }, [trackingToken, enabled, getWebSocketUrl, onLocationUpdate, onSubscriptionConfirmed, subscriptionData?.tripId]);

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    connect();
  }, [connect]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      // Unsubscribe before disconnecting
      if (trackingToken && isSubscribed) {
        socketRef.current.emit("unsubscribe-student-tracking", { trackingToken });
      }
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    setIsSubscribed(false);
    setCurrentLocation(null);
  }, [trackingToken, isSubscribed]);

  useEffect(() => {
    if (trackingToken && enabled) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [trackingToken, enabled, connect, disconnect]);

  // Cleanup on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (socketRef.current && trackingToken) {
        socketRef.current.emit("unsubscribe-student-tracking", { trackingToken });
        socketRef.current.disconnect();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [trackingToken]);

  return {
    currentLocation,
    isConnected,
    isSubscribed,
    error,
    reconnect,
    subscriptionData,
  };
};
