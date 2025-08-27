"use client";

import { ErrorPage } from "@/components/error-page";

export default function CareerError({
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
      title="Career Error"
      description="An error occurred while loading career information. Please try again or return to the main career page."
      backButtonText="Career List"
      backButtonHref="/career"
    />
  );
}
