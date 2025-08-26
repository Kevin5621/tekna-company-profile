import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers - Join Our Team',
  description: 'Discover exciting career opportunities and join our innovative team. We offer competitive salaries, great benefits, and a collaborative work environment.',
  keywords: 'careers, jobs, employment, opportunities, tech jobs, remote work',
  openGraph: {
    title: 'Careers - Join Our Team',
    description: 'Discover exciting career opportunities and join our innovative team.',
    type: 'website',
  },
}

import { PublicLayout } from '@/components/layout/public-layout'

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}
