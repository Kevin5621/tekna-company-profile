'use client';

import { ErrorPage } from '@/components/error-page';

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
      title="Kesalahan Dashboard"
      description="Terjadi kesalahan pada dashboard. Silakan refresh halaman atau hubungi administrator jika masalah berlanjut."
      backButtonText="Dashboard"
      backButtonHref="/dashboard"
    />
  );
}
