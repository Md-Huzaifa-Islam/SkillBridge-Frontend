import { UserRole } from "./index";

declare module "better-auth/types" {
  interface User {
    role: UserRole;
    is_banned: boolean;
  }

  interface Session {
    user: User;
  }
}
