import { env } from "@/env";
import { cookies } from "next/headers";
const authUrl = env.AUTH_URL;
export const userServices = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${authUrl}/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const session = await res.json();
      if (!session.data) {
        return { data: null, error: { message: "No session found" } };
      }
      return {
        data: session,
        error: null,
      };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: {
          message: "Something went wrong",
        },
      };
    }
  },
};
