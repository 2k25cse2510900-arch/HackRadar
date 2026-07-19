import type { Metadata } from "next";
import { AuthProvider, ThemeProvider } from "@/providers";
import { Toaster } from "sonner";
import { RippleButtonProvider } from "@/components/ui/ripple-button";
import "./globals.css";

export const metadata: Metadata = {
  title: "HackRadar",
  description: "Production-grade SaaS frontend foundation for HackRadar",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <RippleButtonProvider />
            {children}
          </AuthProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
