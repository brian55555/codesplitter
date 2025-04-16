import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tempo(), // Add the tempo plugin
  ],
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
  },
  base: "/", // Base path for production deployment
  build: {
    outDir: "dist", // Output directory for build files
    emptyOutDir: true, // Clear the output directory before building
    sourcemap: false, // Disable sourcemaps in production for smaller files
  },
});
