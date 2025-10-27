export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface Profile {
  full_name: string;
  phone: string | null;
}

export type AuthError = Error;

export interface AuthResponse {
  token: string;
  user: {
    id?: string;
    _id?: string;
    email: string;
    full_name: string;
    phone?: string | null;
    isAdmin?: boolean;
  };
}