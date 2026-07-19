"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/providers";
import { isProfileSetupComplete } from "@/lib/profile";

export function ProtectedPage({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const hasRedirected = useRef(false);
  const shouldCompleteProfile = isAuthenticated && !isProfileSetupComplete(user);
  const allowProfilePage = pathname === "/profile";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, loading, pathname, router]);

  useEffect(() => {
    if (!loading && shouldCompleteProfile && !allowProfilePage) {
      if (!hasRedirected.current) {
        toast.info("Please complete your profile setup first so HackRadar can personalize your experience.");
        hasRedirected.current = true;
      }
      router.replace("/profile");
    }
  }, [allowProfilePage, loading, pathname, router, shouldCompleteProfile]);

  if (loading || !isAuthenticated || (shouldCompleteProfile && !allowProfilePage)) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen items-center justify-center px-4 text-sm text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  return children;
}
