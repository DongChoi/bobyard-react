import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  async session({ session }: { session: Session }) {
    console.log("kewl");
  },
  async signIn({ profile }) {
    try {
      //serverless -> lambda -> postgres
    } catch (e) {}
  },
});

export { handler as GET, handler as POST };
