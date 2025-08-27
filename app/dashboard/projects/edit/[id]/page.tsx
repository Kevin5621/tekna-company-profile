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
        { label: "Proyek", href: "/dashboard/projects" },
        {
          label: "Edit Proyek",
          href: `/dashboard/projects/edit/${project.id}`,
        },
        { label: "Form Edit", isCurrentPage: true },
      ]}
      title="Edit Project"
      description="Update project information"
      backHref="/dashboard/projects"
      backLabel="Kembali ke Projects"
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
          }}
        />
      </div>
    </DashboardFormTemplate>
  );
}
