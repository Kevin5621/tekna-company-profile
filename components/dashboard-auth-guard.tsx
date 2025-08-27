"use client";

import React, { useEffect } from "react";
import { useSession } from "./session-provider";
import { useRouter } from "next/navigation";

interface DashboardAuthGuardProps {
  children: React.ReactNode;
}

export function DashboardAuthGuard({ children }: Readonly<DashboardAuthGuardProps>) {
  const { user, session, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionLoading && (!user || !session)) {
      router.push("/auth/login");
    }
  }, [user, session, sessionLoading, router]);

  // Show loading while session is loading
  if (sessionLoading || !user || !session) {
    return (
      <div className="flex flex-1 w-full items-center justify-center min-h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render dashboard
  return <>{children}</>;
}
