// lib/eden.ts
import { app, type App } from "@/app/api/[[...slugs]]/route";
import { treaty } from "@elysiajs/eden";

// Server-side Eden instance (direct function calls)
export const api = treaty(app).api;

// Client-side Eden factory function
export const createClient = () => {
  // Determine base URL for client-side calls
  const baseURL =
    typeof window !== "undefined"
      ? window.location.origin // Use current origin in browser
      : process.env.NEXTAUTH_URL || "http://localhost:3000";

  return treaty<App>(baseURL).api;
};

// Type for the client
export type EdenClient = ReturnType<typeof createClient>;
