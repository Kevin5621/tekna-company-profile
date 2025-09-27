import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailClient } from "@/components/projects/project-detail-client";
import { PublicService } from "@/lib/services/public.service";
import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await PublicService.getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const title = project.meta_title || project.name;
  const description = project.meta_description || project.short_description || project.description.substring(0, 160);
  const keywords = project.meta_keywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: project.featured_image_url ? [
        {
          url: project.featured_image_url,
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ] : undefined,
      type: "website",
      siteName: "PT Sapujagat Nirmana Tekna",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.featured_image_url ? [project.featured_image_url] : undefined,
    },
    alternates: {
      canonical: `/projects/${slug}`,
    },
  };
}

// Generate static params for known projects (optional - for build optimization)
export async function generateStaticParams() {
  try {
    const projects = await PublicService.getAllProjects({ limit: 100 });
    return projects.data.map((project: { slug: string }) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  
  // Fetch project data
  const project = await PublicService.getProjectBySlug(slug);
  
  if (!project) {
    notFound();
  }

  // Fetch related projects
  const relatedProjects = await PublicService.getRelatedProjects(project.id);

  // Custom breadcrumbs for project detail
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: project.name, href: `/projects/${project.slug}`, isActive: true },
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
      <ProjectDetailClient project={project} relatedProjects={relatedProjects} />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.name,
            description: project.short_description || project.description,
            image: project.featured_image_url,
            url: `https://tekna.co.id/projects/${project.slug}`,
            author: {
              "@type": "Organization",
              name: "PT Sapujagat Nirmana Tekna",
              url: "https://tekna.co.id",
            },
            publisher: {
              "@type": "Organization",
              name: "PT Sapujagat Nirmana Tekna",
              url: "https://tekna.co.id",
            },
            dateCreated: project.created_at,
            dateModified: project.updated_at,
            ...(project.project_url && {
              mainEntityOfPage: project.project_url,
            }),
          }),
        }}
      />
    </div>
  );
}