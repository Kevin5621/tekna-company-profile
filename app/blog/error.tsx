"use client";

import { ErrorPage } from "@/components/error-page";

export default function BlogError({
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
      title="Blog Error"
      description="An error occurred while loading blog content. Please try again or return to the main blog page."
      backButtonText="Blog List"
      backButtonHref="/blog"
    />
  );
}
