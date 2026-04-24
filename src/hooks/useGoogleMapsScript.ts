import { useEffect, useState } from "react";
import { config } from "@/lib/config";

/** Libraries needed for Places, Directions, distance helpers, overlays, and advanced markers */
export const GOOGLE_MAPS_LIBRARIES = "places,geometry,marker";

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
  const isMapsReady = () =>
    typeof window.google?.maps?.Map === "function" &&
    // Marker library might still be loading, but Map must exist.
    true;

  const [isLoaded, setIsLoaded] = useState(() => isMapsReady());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isMapsReady()) {
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
        if (isMapsReady()) setIsLoaded(true);
      };
      if (isMapsReady()) {
        done();
        return;
      }
      existing.addEventListener("load", done);
      const interval = window.setInterval(() => {
        if (isMapsReady()) {
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
    // Use Google's recommended loading=async param to avoid performance warning
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAPS_API_KEY}&libraries=${GOOGLE_MAPS_LIBRARIES}&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Some environments briefly expose window.google.maps before Map is ready.
      const started = Date.now();
      const tick = () => {
        if (isMapsReady()) {
          setIsLoaded(true);
          return;
        }
        if (Date.now() - started > 6000) {
          setError("Google Maps loaded but Map constructor not ready");
          return;
        }
        window.setTimeout(tick, 50);
      };
      tick();
    };
    script.onerror = () => setError("Failed to load Google Maps");
    document.head.appendChild(script);
  }, []);

  return { isLoaded, error };
}
