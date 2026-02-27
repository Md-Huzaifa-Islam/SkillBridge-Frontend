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
});
