// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Use a fallback so the build never fails when BACKEND_URL isn't injected
    // yet (e.g. during `next build` on Vercel before env vars are available).
    // api.ts also has the same fallback for runtime safety.
    BACKEND_URL: z.string().url().default("http://localhost:5000/api"),
  },

  //   client: {
  //     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  //   },

  runtimeEnv: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
});
