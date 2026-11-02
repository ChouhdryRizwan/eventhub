import axios from "axios";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const strapi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  timeout: 20000,
});

const THIRTY_DAYS = 30 * 24 * 60 * 60; // matches the Strapi JWT lifetime

class InvalidCredentials extends CredentialsSignin {
  code = "invalid_credentials";
}
class EmailNotConfirmed extends CredentialsSignin {
  code = "email_not_confirmed";
}
class ServiceUnavailable extends CredentialsSignin {
  code = "service_unavailable";
}

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  // updateAge = maxAge: reading the session never re-issues the cookie, so a read that is still in
  // flight when the user logs out cannot bring the session back.
  session: { strategy: "jwt", maxAge: THIRTY_DAYS, updateAge: THIRTY_DAYS },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = String(credentials?.identifier ?? "").trim();
        const password = String(credentials?.password ?? "");
        if (!identifier || !password) throw new InvalidCredentials();

        try {
          // POST /api/auth/local -> { jwt, user }
          const { data } = await strapi.post("/auth/local", { identifier, password });

          // The role is not exposed on the login response; look it up server-side with the
          // full-access token so the client cannot influence it.
          let role = "authenticated";
          try {
            const res = await strapi.get(`/users/${data.user.id}`, {
              params: { "populate[role][fields][0]": "type" },
              headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
            });
            role = res.data?.role?.type ?? role;
          } catch {
            // fall back to the least-privileged role
          }

          return {
            id: String(data.user.id),
            name: data.user.full_name || data.user.username,
            email: data.user.email,
            strapiToken: data.jwt as string,
            role,
            phone: data.user.phone ?? null,
          };
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            // 400 = wrong password / unknown user / unconfirmed / blocked
            if (/not confirmed/i.test(String(error.response.data?.error?.message ?? ""))) throw new EmailNotConfirmed();
            throw new InvalidCredentials();
          }
          throw new ServiceUnavailable();
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      // Profile edits call unstable_update(); mirror the changed fields into the token.
      if (trigger === "update" && session?.user) {
        if (typeof session.user.name === "string") token.name = session.user.name;
        if ("phone" in session.user) token.phone = (session.user.phone as string | null) ?? null;
      }
      if (user) {
        token.strapiToken = user.strapiToken;
        token.role = user.role;
        token.phone = user.phone ?? null;
        token.userId = Number(user.id);
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.strapiToken as string;
      session.user.id = String(token.userId ?? token.sub ?? "");
      session.user.role = (token.role as string) ?? "authenticated";
      session.user.phone = (token.phone as string | null) ?? null;
      return session;
    },
  },
});
