// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BACKEND_URL: z.string().url(),
  },

  //   client: {
  //     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  //   },

  runtimeEnv: {
    BACKEND_URL: process.env.BACKEND_URL,
  },

  // Skip validation during `next build` when env vars may not be available.
  // The actual runtime will still fail fast if BACKEND_URL is missing.
  skipValidation:
    process.env.NEXT_PHASE === "phase-production-build" ||
    !!process.env.SKIP_ENV_VALIDATION,
});
