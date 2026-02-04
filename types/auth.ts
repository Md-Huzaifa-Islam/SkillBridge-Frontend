import { UserRole } from "./index";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
  };
  session: {
    token: string;
    expiresAt: string;
  };
}
