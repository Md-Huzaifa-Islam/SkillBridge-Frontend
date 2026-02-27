import { cookies } from "next/headers";
import { UserRoles } from "@/constants/roles";

export type SessionUser = {
  id: string;
  role: string;
  email: string;
  name?: string;
};

export type Session = {
  user: SessionUser;
  token: string;
} | null;

function decodeJwtPayload(token: string) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = Buffer.from(base64Payload, "base64url").toString("utf-8");
    return JSON.parse(payload) as {
      id: string;
      role: string;
      email: string;
      exp: number;
    };
  } catch {
    return null;
  }
}

/**
 * Get session from cookie — server components only.
 * Does NOT verify JWT signature (that's the backend's job).
 * For UI-level role checks and pre-fetching.
 */
export async function getSession(): Promise<Session> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload || payload.exp * 1000 <= Date.now()) return null;
  return {
    user: { id: payload.id, role: payload.role, email: payload.email },
    token,
  };
}

export async function getToken(): Promise<string | null> {
  const session = await getSession();
  return session?.token ?? null;
}

export function isRole(role: string, ...roles: string[]) {
  return roles.includes(role);
}

export const Roles = UserRoles;
