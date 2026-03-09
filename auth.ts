import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ADMIN_EMAILS = (process.env.ADMIN_GOOGLE_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  trustHost: true,
  // NextAuth v5 uses AUTH_SECRET env var (also accepts NEXTAUTH_SECRET for compat)
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    /**
     * Gate access: only emails listed in ADMIN_GOOGLE_EMAILS env var are allowed.
     * Returning false rejects sign-in and redirects to the error page (our login page).
     */
    signIn({ user }) {
      const email = user.email?.toLowerCase() ?? "";
      if (ADMIN_EMAILS.length === 0) return false; // deny all if env not set
      return ADMIN_EMAILS.includes(email);
    },
    jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      if (user?.name) token.name = user.name;
      if (user?.image) token.picture = user.image;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
});
