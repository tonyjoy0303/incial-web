import AuthSessionProvider from "@/components/admin/AuthSessionProvider";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

/**
 * Server component entry for the admin layout group.
 * Provides the NextAuth SessionProvider for all admin pages.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSessionProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AuthSessionProvider>
  );
}
