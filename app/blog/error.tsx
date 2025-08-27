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
      title="Kesalahan Blog"
      description="Terjadi kesalahan saat memuat konten blog. Silakan coba lagi atau kembali ke halaman blog utama."
      backButtonText="Daftar Blog"
      backButtonHref="/blog"
    />
  );
}
