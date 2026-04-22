import { useEffect, useState } from "react";
import { config } from "@/lib/config";

/** Libraries needed for Places, Directions, distance helpers, and overlays */
export const GOOGLE_MAPS_LIBRARIES = "places,geometry";

const SCRIPT_MARKER_ID = "rocketroll-google-maps-js";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
  }
}

/**
 * Loads the Maps JavaScript API once (places + geometry). Safe across routes.
 */
export function useGoogleMapsScript(): {
  isLoaded: boolean;
  error: string | null;
} {
  const [isLoaded, setIsLoaded] = useState(() => !!window.google?.maps);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const existing =
      (document.getElementById(SCRIPT_MARKER_ID) as HTMLScriptElement | null) ||
      (document.querySelector(
        'script[src*="maps.googleapis.com"]'
      ) as HTMLScriptElement | null);

    if (existing) {
      const done = () => {
        if (window.google?.maps) setIsLoaded(true);
      };
      if (window.google?.maps) {
        done();
        return;
      }
      existing.addEventListener("load", done);
      const interval = window.setInterval(() => {
        if (window.google?.maps) {
          done();
          window.clearInterval(interval);
        }
      }, 100);
      return () => {
        existing.removeEventListener("load", done);
        window.clearInterval(interval);
      };
    }

    const script = document.createElement("script");
    script.id = SCRIPT_MARKER_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAPS_API_KEY}&libraries=${GOOGLE_MAPS_LIBRARIES}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.maps) setIsLoaded(true);
      else setError("Google Maps failed to initialize");
    };
    script.onerror = () => setError("Failed to load Google Maps");
    document.head.appendChild(script);
  }, []);

  return { isLoaded, error };
}
