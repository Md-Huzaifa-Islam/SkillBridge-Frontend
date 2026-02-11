import { betterAuth } from "better-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const auth = betterAuth({
  baseURL: API_URL,
  basePath: "/auth",
});

export type Session = typeof auth.$Infer.Session;
