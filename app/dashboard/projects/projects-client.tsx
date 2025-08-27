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
  IconEdit,
  IconTrash,
  IconLoader2,
} from "@tabler/icons-react";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import useSWR, { mutate as globalMutate } from "swr";
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
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: apiPayload } = useSWR("/api/projects", fetcher, {
    fallbackData: { success: true, data: initialProjects },
    revalidateOnFocus: true,
  });

  const projects = (apiPayload?.data as Project[]) || initialProjects;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const { toast } = useToast();

  // derive filtered list from query for client-side search
  const q = query.trim().toLowerCase();
  const filteredProjects = q
    ? projects.filter((p) => {
        const name = p.name?.toLowerCase() || "";
        const desc = p.description?.toLowerCase() || "";
        return name.includes(q) || desc.includes(q);
      })
    : projects;

  const handleDelete = async (projectId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      return;
    }

    setDeletingId(projectId);
    try {
      // optimistic update: remove locally first
      const optimistic = projects.filter((p) => p.id !== projectId);
      // update SWR cache locally
      globalMutate(
        "/api/projects",
        { success: true, data: optimistic },
        false
      );

      await ClientDashboardService.deleteProject(projectId);
      // revalidate in background
      globalMutate("/api/projects");
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
      // revert cache on error
      globalMutate("/api/projects");
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
            <Input
              placeholder="Cari proyek..."
              className="pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {/* Filter removed per request */}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
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
        // show different message when there are no projects at all vs no results for query
        projects.length === 0 ? (
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
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <IconFolder className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Tidak ada proyek yang cocok</h3>
              <p className="text-muted-foreground text-center mb-4">Coba kata kunci lain.</p>
            </CardContent>
          </Card>
        )
      )}
    </DashboardPageTemplate>
  );
}
