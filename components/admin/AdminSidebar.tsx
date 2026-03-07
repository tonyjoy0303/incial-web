"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  BookOpen,
  Briefcase,
  Package,
  Settings2,
  LogOut,
  Layers,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/about", label: "About", icon: Users },
  { href: "/admin/clients", label: "Clients", icon: Building2 },
  { href: "/admin/trust", label: "Training Stats", icon: BarChart3 },
  { href: "/admin/blogs", label: "Blogs", icon: BookOpen },
  { href: "/admin/casestudies", label: "Case Studies", icon: Briefcase },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/services", label: "Services", icon: Layers },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-60 shrink-0 border-r border-[#1e1e1e] flex flex-col bg-black">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black text-xs font-black">I</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-wide font-[Poppins,sans-serif]">
              INCIAL
            </div>
            <div className="text-[10px] text-[#8e8e8e] uppercase tracking-widest font-[Inter,sans-serif]">
              Admin
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname.startsWith(href) && pathname !== "/admin";
          const dashboardActive = exact && pathname === "/admin";
          const active = isActive || dashboardActive;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-[Inter,sans-serif] transition-colors group ${
                active
                  ? "bg-white text-black font-semibold"
                  : "text-[#8e8e8e] hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              <Icon
                size={16}
                className={`shrink-0 ${active ? "text-black" : "text-[#8e8e8e] group-hover:text-white"}`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#1e1e1e]">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-[Inter,sans-serif] text-[#8e8e8e] hover:text-red-500 hover:bg-red-500/10 w-full transition-colors"
        >
          <LogOut size={16} className="shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
