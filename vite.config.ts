import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        nested: resolve(__dirname, "index-en.html"),
      },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("ramda")) {
              return "ramda";
            }
            if (id.includes("@fortawesome")) {
              return "fontawesome";
            }
            if (id.includes("html2canvas") || id.includes("jspdf")) {
              return "pdf-tools";
            }
            if (id.includes("@supabase/supabase-js")) {
              return "supabase";
            }
            if (id.includes("axios")) {
              return "axios";
            }
            if (id.includes("bootstrap") || id.includes("react-bootstrap")) {
              return "bootstrap";
            }
            if (
              id.includes("react-dom") ||
              id.includes("react-router-dom") ||
              id.includes("react/")
            ) {
              return "vendor";
            }
            return "vendor";
          }

          if (id.includes("src/charSheets") || id.includes("src\\charSheets")) {
            return "char-sheets";
          }

          if (id.includes("src/ui/EncyclopediaPage") || id.includes("src\\ui\\EncyclopediaPage")) {
            return "encyclopedia";
          }
        },
      },
    },
  },
});
