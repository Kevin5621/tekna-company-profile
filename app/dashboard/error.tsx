"use client";

import { ErrorPage } from "@/components/error-page";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title="Dashboard Error"
      description="An error occurred on the dashboard. Please refresh the page or contact the administrator if the problem persists."
      backButtonText="Dashboard"
      backButtonHref="/dashboard"
    />
  );
}
