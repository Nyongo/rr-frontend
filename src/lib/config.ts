/**
 * Application configuration
 * Loads values from environment variables with fallbacks for development
 *
 * Note: Vite automatically loads .env files from the project root.
 * Variables must be prefixed with VITE_ to be exposed to client code.
 */

const getEnvVar = (key: string, fallback: string): string => {
  // Vite exposes env variables via import.meta.env
  // In development, this will use values from .env file
  // In production, use build-time values
  const value = import.meta.env[key];

  // Debug: Log in development to verify env vars are loaded
  if (import.meta.env.DEV && !value) {
    console.warn(
      `⚠️ Environment variable ${key} not found, using fallback: ${fallback}`
    );
  }

  return value || fallback;
};

export const config = {
  // API Base URL - each service file defines its own path suffix
  API_BASE_URL: getEnvVar("VITE_API_BASE_URL", "http://localhost:3000"),

  // Google Maps API
  GOOGLE_MAPS_API_KEY: getEnvVar(
    "VITE_GOOGLE_MAPS_API_KEY",
    "AIzaSyD15fDdmqNVINe8CtDWJkUJD3TNVIbg_B8"
  ),
};

// Log config in development (without sensitive values)
if (import.meta.env.DEV) {
  console.log("🔧 App Configuration:", {
    API_BASE_URL: config.API_BASE_URL,
    GOOGLE_MAPS_API_KEY: config.GOOGLE_MAPS_API_KEY
      ? `${config.GOOGLE_MAPS_API_KEY.substring(0, 10)}...`
      : "not set",
  });
}
