"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Toaster } from "sonner";

/**
 * Client component that handles session-based routing and renders
 * the admin shell (sidebar + header) for authenticated users.
 */
export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") return;
    if (status === "unauthenticated") {
      router.replace("/admin/login");
    }
  }, [status, pathname, router]);

  // Avoid flash: show nothing while session resolves on non-login pages
  if (pathname !== "/admin/login" && status === "loading") return null;

  // Login page renders standalone (no sidebar/header)
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="admin-panel flex w-full h-screen bg-black text-white font-[Inter,sans-serif] overflow-hidden">
      <Toaster position="bottom-right" theme="dark" richColors />
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto w-full">{children}</main>
      </div>
    </div>
  );
}
