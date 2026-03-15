import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google'
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/general/Navbar";
import { TooltipProvider } from "./components/ui/tooltip";

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '600', '700'] })

export const metadata: Metadata = {
  title: "Courtside",
  description: "Court booking website for tennis, badminton and padel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className}`}
      >
        <AuthProvider>
          <TooltipProvider>
          <Navbar/>
          {children}
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
