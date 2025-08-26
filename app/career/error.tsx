'use client';

import { ErrorPage } from '@/components/error-page';

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
      title="Kesalahan Karir"
      description="Terjadi kesalahan saat memuat informasi karir. Silakan coba lagi atau kembali ke halaman karir utama."
      backButtonText="Daftar Karir"
      backButtonHref="/career"
    />
  );
}
