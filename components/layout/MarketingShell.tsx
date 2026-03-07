"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CustomCursor, Ribbons } from "@/components/ui";

export default function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Toggle the hide-cursor CSS class on the body element
  useEffect(() => {
    if (isAdmin) {
      document.body.classList.remove("hide-cursor");
    } else {
      document.body.classList.add("hide-cursor");
    }
    return () => {
      document.body.classList.remove("hide-cursor");
    };
  }, [isAdmin]);

  return (
    <>
      {children}
      {!isAdmin && (
        <div className="fixed inset-0 z-[999999] pointer-events-none">
          <Ribbons colors={["#60A5FA"]} baseThickness={8} pointCount={35} />
          <CustomCursor />
        </div>
      )}
    </>
  );
}
