"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Thin wrapper so the admin layout (a "use client" component)
 * can use NextAuth's useSession() hook.
 */
export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
