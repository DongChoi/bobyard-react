import NextAuth, { AuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  async session({ session }) {
    return session;
  },
  async signIn({ profile }) {
    try {
      //serverless -> lambda -> postgres
    } catch (e) {}
  },
});

export { handler as GET, handler as POST };
