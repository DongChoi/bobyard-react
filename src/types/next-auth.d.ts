import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;

      // Custom fields
      handle: string;
      provider: string;
      providerAccountId: string;
    } & DefaultSession["user"];
  }
  interface JWT {
    provider?: string;
    providerAccountId?: string;
    handle?: string;
  }
}
