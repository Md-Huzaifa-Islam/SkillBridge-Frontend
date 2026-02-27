// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BACKEND_URL: z.string().url().default("http://localhost:5000/api"),
  },

  runtimeEnv: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
});
