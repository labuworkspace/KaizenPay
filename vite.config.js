import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Цей рядок пов'язує символ @ з папкою src
      "@": path.resolve(__dirname, "./src"),
    },
  },
})