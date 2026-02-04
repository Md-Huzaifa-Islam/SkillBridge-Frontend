import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  basePath: "/auth",
});

export type Session = typeof auth.$Infer.Session;
