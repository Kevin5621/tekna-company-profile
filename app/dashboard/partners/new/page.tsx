import { Metadata } from 'next';
import { Suspense } from 'react';
import PartnerForm from '../partner-form';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Add New Partner',
  description: 'Add a new partner to your company profile',
};

export default function NewPartnerPage() {
  return (
    <div className="dashboard-form-page">
      <Suspense fallback={<Skeleton className="w-full h-96" />}>
        <div className="dashboard-form-container">
          <PartnerForm />
        </div>
      </Suspense>
    </div>
  );
}
