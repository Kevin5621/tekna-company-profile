"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/project-form";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import { DashboardFormTemplate } from "@/components/dashboard/dashboard-form-template";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const [project, setProject] = useState<{
    id: string;
    name: string;
    slug: string;
    project_url: string | null;
    description: string | null;
    featured_image_url: string | null;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    // Additional fields from project_translations and project_images
    short_description?: string;
    meta_title?: string;
    meta_description?: string;
    technologies?: string;
    client_name?: string;
    project_date?: string;
    project_duration?: string;
    team_size?: string;
    project_status?: string;
    gallery_images?: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getProject() {
      try {
        const resolvedParams = await params;
        const projectData = await ClientDashboardService.getProjectById(
          resolvedParams.id
        );
        setProject(projectData);
      } catch (error) {
        console.error("Error fetching project:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    getProject();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !project) {
    notFound();
  }

  return (
    <DashboardFormTemplate
      breadcrumbs={[
        { label: "Projects", href: "/dashboard/projects" },
        {
          label: "Edit Project",
          href: `/dashboard/projects/edit/${project.id}`,
        },
        { label: "Edit Form", isCurrentPage: true },
      ]}
      title="Edit Project"
      description="Update project information"
      backHref="/dashboard/projects"
      backLabel="Back to Projects"
    >
      <div className="dashboard-form-container">
        <ProjectForm
          mode="edit"
          projectId={project.id}
          initialData={{
            name: project.name,
            slug: project.slug,
            project_url: project.project_url || "",
            description: project.description || "",
            featured_image_url: project.featured_image_url || "",
            is_featured: project.is_featured || false,
            // Use actual data from project_translations and project_images
            overview_content: project.description || "", // This should come from project_translations.description
            short_description: project.short_description || "",
            meta_title: project.meta_title || "",
            meta_description: project.meta_description || "",
            technologies: project.technologies || "",
            client_name: project.client_name || "",
            project_date: project.project_date || "",
            project_duration: project.project_duration || "",
            team_size: project.team_size || "",
            project_status: project.project_status || "completed",
            gallery_images: project.gallery_images || [],
          }}
        />
      </div>
    </DashboardFormTemplate>
  );
}
