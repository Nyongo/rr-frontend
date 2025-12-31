import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  // Vite automatically loads .env files, but loadEnv makes it explicit
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: parseInt(env.VITE_PORT || "8080", 10),
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Explicitly define which env vars should be exposed to client
    // Vite automatically exposes all VITE_* variables, but this makes it clear
    envPrefix: "VITE_",
  };
});
