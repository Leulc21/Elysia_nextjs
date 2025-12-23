// lib/eden.ts
import { app, type App } from "@/app/api/[[...slugs]]/route";
import { treaty } from "@elysiajs/eden";

// Check if we're in the browser
const isBrowser = typeof window !== "undefined";

// Get the base URL - adjust for your environment
const baseURL = isBrowser
  ? window.location.origin + "/api" // Browser: use current origin
  : process.env.NEXTAUTH_URL
    ? process.env.NEXTAUTH_URL + "/api" // Production server
    : "http://localhost:3000/api"; // Development server

export const api = isBrowser
  ? treaty<App>(baseURL).api // Client-side: use HTTP
  : treaty(app).api; // Server-side: direct call
