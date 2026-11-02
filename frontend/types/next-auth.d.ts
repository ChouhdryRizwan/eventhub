import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    strapiToken?: string;
    role?: string;
    phone?: string | null;
  }

  interface Session {
    /** Strapi JWT; send as `Authorization: Bearer` for authenticated API calls. */
    accessToken: string;
    user: {
      id: string;
      role: string;
      phone: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    strapiToken?: string;
    role?: string;
    phone?: string | null;
    userId?: number;
  }
}
