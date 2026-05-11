import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { loginSchema } from "@/schema/auth_schema";
import { loginResponse } from "@/types/auth_types";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {

        //Validation in server side of next js using zod
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/auth/root-login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(parsed.data),
              cache: "no-store",
            }
          );

          const result: loginResponse = await response.json();

          if (!result.success) {
            return null;
          }

          return {
            id: result.data.user_id,
            email: parsed.data.email,
            accessToken: result.data.access_token,
            sessionId: result.data.session_id,
            tenantId: result.data.tenant_id,
            userType: result.data.user_type,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.sessionId = user.sessionId;
        token.tenantId = user.tenantId;
        token.userType = user.userType;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.sessionId = token.sessionId as string;
      session.tenantId = token.tenantId as string;
      session.userType = token.userType as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};