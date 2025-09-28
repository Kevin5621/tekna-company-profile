"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconFolder,
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconLoader2,
  IconExternalLink,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import useSWR, { mutate as globalMutate } from "swr";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_featured: boolean;
  is_active: boolean;
  featured_image_url?: string;
  created_at: string;
  updated_at: string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"created_at" | "name" | "is_featured">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description &&
          project.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || 
        (statusFilter === "active" && project.is_active) ||
        (statusFilter === "inactive" && !project.is_active);
      return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | Date | boolean, bValue: string | Date | boolean;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "is_featured":
          aValue = a.is_featured;
          bValue = b.is_featured;
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [projects, searchTerm, statusFilter, sortBy, sortOrder]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-3 items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage company projects and portfolios
          </p>
        </div>
        
        <Button size="sm" onClick={handleAddNew}>
          <IconPlus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-40">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="w-full sm:w-40">
          <Select value={sortBy} onValueChange={(value: "created_at" | "name" | "is_featured") => setSortBy(value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="is_featured">Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="w-9 h-9"
        >
          {sortOrder === "asc" ? (
            <IconSortAscending className="h-4 w-4" />
          ) : (
            <IconSortDescending className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-xs text-muted-foreground">
            {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        {filteredProjects.length === 0 ? (
          <Card className="border-2 border-dashed border-muted bg-muted/30">
            <CardContent className="p-8 text-center">
              <IconFolder className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-medium mb-2">No projects found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Start creating your first project."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button size="sm" onClick={handleAddNew}>
                  <IconPlus className="w-4 h-4 mr-2" />
                  Create First Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-sm transition-all duration-200 overflow-hidden">
                <CardContent className="p-0">
                  {/* Featured Image */}
                  <div className="aspect-[16/10] bg-muted/50 flex items-center justify-center relative overflow-hidden">
                    {project.featured_image_url ? (
                      <Image
                        src={project.featured_image_url}
                        alt={project.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="text-center space-y-1">
                        <IconFolder className="w-8 h-8 text-muted-foreground mx-auto" />
                        <p className="text-xs text-muted-foreground">No Image</p>
                      </div>
                    )}
                    
                    {/* Hover overlay with actions */}
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        asChild
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-3"
                      >
                        <Link href={`/projects/${project.slug}`} target="_blank">
                          <IconExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(project.id)}
                        className="bg-background hover:bg-background/90 text-foreground h-8 px-3"
                      >
                        <IconEdit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="h-8 px-3"
                      >
                        {deletingId === project.id ? (
                          <IconLoader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <IconTrash className="w-3 h-3 mr-1" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {/* Project Info */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                          {project.name}
                        </h3>
                        {project.is_featured && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      {project.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span>{formatDate(project.created_at)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={project.is_active ? "default" : "secondary"} 
                          className={project.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {project.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
