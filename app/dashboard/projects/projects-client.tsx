"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IconFolder,
  IconPlus,
  IconSearch,
  IconFilter,
  IconEdit,
  IconTrash,
  IconLoader2,
} from "@tabler/icons-react";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import { useToast } from "@/hooks/use-toast";
import { DashboardPageTemplate } from "@/components/dashboard/dashboard-page-template";

interface Project {
  id: string;
  name: string;
  description?: string;
  is_featured: boolean;
  is_active: boolean;
  featured_image_url?: string;
}

interface ProjectsPageProps {
  initialProjects: Project[];
}

export default function ProjectsPageClient({
  initialProjects,
}: Readonly<ProjectsPageProps>) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (projectId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      return;
    }

    setDeletingId(projectId);
    try {
      await ClientDashboardService.deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast({
        title: "Project Deleted!",
        description: "Project has been deleted successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Delete Failed",
        description: "Gagal menghapus proyek",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (projectId: string) => {
    router.push(`/dashboard/projects/edit/${projectId}`);
  };

  const handleAddNew = () => {
    router.push("/dashboard/projects/new");
  };

  const actions = (
    <Button onClick={handleAddNew}>
      <IconPlus className="h-4 w-4 mr-2" />
      Tambah Proyek
    </Button>
  );

  return (
    <DashboardPageTemplate
      breadcrumbs={[
        { label: "Proyek", href: "/dashboard/projects" },
        { label: "Daftar Proyek", isCurrentPage: true },
      ]}
      title="Kelola Proyek"
      description="Kelola semua proyek perusahaan dalam satu tempat"
      actions={actions}
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari proyek..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <IconFilter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow"
            >
              {/* Project Image */}
              {project.featured_image_url && (
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={project.featured_image_url}
                    alt={project.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {!project.featured_image_url && (
                      <IconFolder className="h-5 w-5 text-muted-foreground" />
                    )}
                    <CardTitle className="text-lg">
                      {project.name}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    {project.is_featured && (
                      <Badge variant="secondary" className="text-xs">
                        Unggulan
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(project.id)}
                    >
                      <IconEdit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                    >
                      {deletingId === project.id ? (
                        <IconLoader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <IconTrash className="h-4 w-4 mr-1" />
                      )}
                      Hapus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <IconFolder className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Belum ada proyek
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Mulai dengan menambahkan proyek pertama Anda
            </p>
            <Button onClick={handleAddNew}>
              <IconPlus className="h-4 w-4 mr-2" />
              Tambah Proyek
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardPageTemplate>
  );
}
