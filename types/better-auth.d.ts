import type { UserRole } from "./index";

declare module "better-auth/types" {
  interface User {
    role: UserRole;
    is_banned: boolean;
  }
}

declare module "better-auth/react" {
  interface Session {
    user: {
      id: string;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null;
      createdAt: Date;
      updatedAt: Date;
      role: UserRole;
      is_banned: boolean;
    };
  }
}
