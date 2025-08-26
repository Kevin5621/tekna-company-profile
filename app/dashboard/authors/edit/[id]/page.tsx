'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AuthorForm } from '@/components/author-form';
import { ClientDashboardService } from '@/lib/services/client-dashboard.service';
import Link from 'next/link';
import { DashboardBreadcrumb } from '@/components/ui/dashboard-breadcrumb';
import BackButton from '@/components/ui/back-button';

export default function EditAuthorPage() {
  const params = useParams();
  const authorId = params.id as string;
  const [initialData, setInitialData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    avatar_url: string;
    linkedin_url: string;
    twitter_url: string;
    github_url: string;
    is_active: boolean;
    sort_order: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAuthor() {
      try {
        const author = await ClientDashboardService.getAuthorById(authorId);
        if (author) {
          setInitialData({
            first_name: author.first_name || '',
            last_name: author.last_name || '',
            email: '',
            phone: '',
            position: author.position || '',
            department: author.department || '',
            avatar_url: author.avatar_url || '',
            linkedin_url: '',
            twitter_url: '',
            github_url: '',
            is_active: author.is_active ?? true,
            sort_order: 0,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data author');
      } finally {
        setIsLoading(false);
      }
    }

    if (authorId) {
      fetchAuthor();
    }
  }, [authorId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Memuat data author...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Link
              href="/dashboard/authors"
              className="text-primary hover:underline"
            >
              ← Kembali ke Authors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb 
        items={[
          { label: "Penulis", href: "/dashboard/authors" },
          { label: "Edit Penulis", href: `/dashboard/authors/edit/${authorId}` },
          { label: "Form Edit", isCurrentPage: true }
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/authors" label="Kembali ke Authors" />
      </div>

      {initialData && (
        <AuthorForm 
          authorId={authorId}
          initialData={initialData}
        />
      )}
    </div>
  );
}
