import { Metadata } from "next";
import { ProjectsListingClient } from "@/components/projects/projects-listing-client";
import { PublicService } from "@/lib/services/public.service";
import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";

interface ProjectData {
  id: string;
  name: string;
  slug: string;
  project_url?: string;
  featured_image_url?: string;
  description: string;
  short_description?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export const metadata: Metadata = {
  title: "Our Projects - PT Sapujagat Nirmana Tekna",
  description: "Explore our portfolio of innovative projects, from web applications to IoT solutions. Each project represents our commitment to excellence and cutting-edge technology.",
  keywords: "projects, portfolio, web development, mobile apps, IoT solutions, software development, PT Sapujagat Nirmana Tekna",
  openGraph: {
    title: "Our Projects - PT Sapujagat Nirmana Tekna",
    description: "Explore our portfolio of innovative projects, from web applications to IoT solutions.",
    type: "website",
    siteName: "PT Sapujagat Nirmana Tekna",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Projects - PT Sapujagat Nirmana Tekna",
    description: "Explore our portfolio of innovative projects, from web applications to IoT solutions.",
  },
  alternates: {
    canonical: "/projects",
  },
};

interface ProjectsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    featured?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: Readonly<ProjectsPageProps>) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const search = resolvedSearchParams.search;
  const featured = resolvedSearchParams.featured === "true";

  // Fetch initial projects data
  const projectsData = await PublicService.getAllProjects({
    page,
    limit: 12,
    search,
    featured: featured || undefined,
  });

  // Custom breadcrumbs for projects listing
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects", isActive: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <BlogBreadcrumbs customItems={breadcrumbItems} />
        </div>
      </div>

      {/* Main Content */}
      <ProjectsListingClient
        initialProjects={projectsData.data}
        initialPagination={projectsData.pagination}
      />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Our Projects",
            description: "Explore our portfolio of innovative projects, from web applications to IoT solutions.",
            url: "https://tekna.co.id/projects",
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: projectsData.pagination.total,
              itemListElement: projectsData.data.map((project: ProjectData, index: number) => ({
                "@type": "CreativeWork",
                position: index + 1,
                name: project.name,
                description: project.description,
                url: `https://tekna.co.id/projects/${project.slug}`,
                ...(project.featured_image_url && {
                  image: project.featured_image_url,
                }),
                author: {
                  "@type": "Organization",
                  name: "PT Sapujagat Nirmana Tekna",
                },
                dateCreated: project.created_at,
                dateModified: project.updated_at,
              })),
            },
            provider: {
              "@type": "Organization",
              name: "PT Sapujagat Nirmana Tekna",
              url: "https://tekna.co.id",
            },
          }),
        }}
      />
    </div>
  );
}