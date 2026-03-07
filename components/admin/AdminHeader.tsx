"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import Image from "next/image";

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/about": "About Section",
  "/admin/clients": "Clients Section",
  "/admin/trust": "Training & Trust Stats",
  "/admin/blogs": "Blog Posts",
  "/admin/casestudies": "Case Studies",
  "/admin/products": "Products",
  "/admin/settings": "Section Settings",
  "/admin/services": "Services",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Admin";
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <header className="h-14 border-b border-[#1e1e1e] px-6 flex items-center justify-between shrink-0 bg-black">
      <div>
        <h1 className="text-sm font-semibold text-white/90 font-[Poppins,sans-serif]">
          {title}
        </h1>
        <p className="text-[11px] text-[#8e8e8e] mt-0.5 font-[Inter,sans-serif]">
          incial.com / admin
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-[11px] text-[#8e8e8e] font-[Inter,sans-serif]">
            Live
          </span>
        </div>

        {/* User avatar + name */}
        {user && (
          <div className="flex items-center gap-2">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Admin"}
                width={28}
                height={28}
                className="rounded-full border border-[#2a2a2a]"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-white/10 border border-[#2a2a2a] flex items-center justify-center">
                <span className="text-white text-[11px] font-semibold">
                  {user.name?.charAt(0) ?? "A"}
                </span>
              </div>
            )}
            <span className="text-[12px] text-white/60 font-[Inter,sans-serif] hidden sm:block max-w-[140px] truncate">
              {user.email}
            </span>
          </div>
        )}

        {/* Sign out button */}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          title="Sign out"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1e1e1e] hover:border-[#333] hover:bg-white/5 text-[#8e8e8e] hover:text-white text-[12px] transition-all duration-200"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline font-[Inter,sans-serif]">
            Sign out
          </span>
        </button>
      </div>
    </header>
  );
}
