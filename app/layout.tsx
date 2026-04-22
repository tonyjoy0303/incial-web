import type { Metadata } from "next";
import { Poppins, Noto_Sans } from "next/font/google";
import "./globals.css";
import MarketingShell from "@/components/layout/MarketingShell";
import DesktopOnlyScreen from "@/components/ui/DesktopOnlyScreen";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://incial.com",
  ),
  title: "Incial — We Build Brand,Business & Beyond",
  description:
    "Incial is a creative digital agency building brands, experiences, and products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <body
        suppressHydrationWarning
        className={`${poppins.variable} ${notoSans.variable} font-sans antialiased h-full w-full`}
      >
        <DesktopOnlyScreen />
        <div className="desktop-experience-shell h-full w-full">
          <MarketingShell>{children}</MarketingShell>
        </div>
      </body>
    </html>
  );
}
