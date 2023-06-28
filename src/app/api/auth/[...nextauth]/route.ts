import { User } from "@prisma/client";
import NextAuth, { JWT, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
const prisma = new PrismaClient();
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, secret }: any) {
      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token, user }: any) {
      // Add the provider to the session;
      // session.user.handle =
      //   token.provider === "google"
      //     ? (token.providerAccountId as string)
      //     : (token.email as string);
      session.user.provider = token.provider as string;
      session.user.providerAccountId = token.providerAccountId as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
