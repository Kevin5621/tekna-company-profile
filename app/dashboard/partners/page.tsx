import { Metadata } from 'next';
import { Suspense } from 'react';
import PartnersClient from './partners-client';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Partners Management',
  description: 'Manage your company partners',
};

export default function PartnersPage() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-96" />}>
      <PartnersClient />
    </Suspense>
  );
}
