"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconLoader2,
  IconX,
  IconUpload,
} from "@tabler/icons-react";
import { MarkdownEditor } from "@/components/markdown-editor";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import { mutate as globalMutate } from "swr";
import { MediaUpload } from "@/components/media-upload";
import type { MediaFile } from "@/lib/services/media.service";
import { useToast } from "@/hooks/use-toast";
import { SlugInput } from "@/components/ui/slug-input";

interface ProjectFormData {
  name: string;
  slug: string;
  project_url: string;
  description: string;
  featured_image_url: string;
  is_featured: boolean;
  // Tab 2: Project Overview 
  gallery_images: string[]; // Array of image URLs
  // Tab 3: Project Information
  short_description: string;
  technologies: string;
  client_name: string;
  project_date: string;
  project_duration: string;
  team_size: string;
  project_status: string;
  // Tab 4: SEO & Meta
  meta_title: string;
  meta_description: string;
}

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: Partial<ProjectFormData>;
  projectId?: string;
}

export function ProjectForm({
  mode,
  initialData,
  projectId,
}: Readonly<ProjectFormProps>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    project_url: initialData?.project_url || "",
    description: initialData?.description || "",
    featured_image_url: initialData?.featured_image_url || "",
    is_featured: initialData?.is_featured || false,
    // Tab 2: Project Overview
    gallery_images: initialData?.gallery_images || [],
    // Tab 3: Project Information
    short_description: initialData?.short_description || "",
    technologies: initialData?.technologies || "",
    client_name: initialData?.client_name || "",
    project_date: initialData?.project_date || "",
    project_duration: initialData?.project_duration || "",
    team_size: initialData?.team_size || "",
    project_status: initialData?.project_status || "completed",
    // Tab 4: SEO & Meta
    meta_title: initialData?.meta_title || "",
    meta_description: initialData?.meta_description || "",
  });

  const { toast } = useToast();

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Submitting form data:", formData);

      if (mode === "create") {
        // Optimistic create: build temp object and update SWR cache immediately
        const tempId = `temp-${Date.now()}`;
        const optimisticProject = {
          id: tempId,
          name: formData.name,
          description: formData.description,
          is_featured: formData.is_featured,
          is_active: true,
          featured_image_url: formData.featured_image_url || undefined,
        };

        // update local cache
        interface ProjectCacheItem { 
          id: string; 
          name: string; 
          description?: string; 
          featured_image_url?: string; 
          is_featured?: boolean; 
          is_active?: boolean;
        }

        globalMutate(
          "/api/projects",
          async (current: { data?: ProjectCacheItem[] } | undefined) => {
            const existing = (current?.data as ProjectCacheItem[]) || [];
            return { success: true, data: [optimisticProject as ProjectCacheItem, ...existing] };
          },
          false
        );

        try {
          // create on server via API route
          const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.name,
              slug: formData.slug,
              project_url: formData.project_url || undefined,
              description: formData.description || undefined,
              featured_image_url: formData.featured_image_url || undefined,
              is_featured: formData.is_featured,
              // New detail fields
              short_description: formData.short_description || undefined,
              meta_title: formData.meta_title || undefined,
              meta_description: formData.meta_description || undefined,
              technologies: formData.technologies || undefined,
              client_name: formData.client_name || undefined,
              project_date: formData.project_date || undefined,
              project_duration: formData.project_duration || undefined,
              team_size: formData.team_size || undefined,
              project_status: formData.project_status || undefined,
            }),
          });

          if (!res.ok) throw new Error("Failed to create project");

          await res.json();
          // replace temp item with real one by revalidating
          await globalMutate("/api/projects");

          toast({
            title: "Project Created!",
            description: "Project has been created successfully.",
            variant: "success",
          });
          router.push("/dashboard/projects");
        } catch (err) {
          console.error("Create failed, reverting optimistic update", err);
          // revert
          globalMutate("/api/projects");
          toast({
            title: "Error",
            description: "Failed to create project. Please try again.",
            variant: "destructive",
          });
        }
      } else if (mode === "edit" && projectId) {
        const result = await ClientDashboardService.updateProject(projectId, {
          name: formData.name,
          slug: formData.slug,
          project_url: formData.project_url || undefined,
          description: formData.description || undefined,
          featured_image_url: formData.featured_image_url || undefined,
          is_featured: formData.is_featured,
          // New detail fields
          short_description: formData.short_description || undefined,
          meta_title: formData.meta_title || undefined,
          meta_description: formData.meta_description || undefined,
          technologies: formData.technologies || undefined,
          client_name: formData.client_name || undefined,
          project_date: formData.project_date || undefined,
          project_duration: formData.project_duration || undefined,
          team_size: formData.team_size || undefined,
          project_status: formData.project_status || undefined,
        });
        console.log("Update result:", result);
        toast({
          title: "Project Updated!",
          description: "Project has been updated successfully.",
          variant: "success",
        });
  // revalidate projects list
  globalMutate("/api/projects");
  router.push("/dashboard/projects");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaUploadSuccess = (file: MediaFile) => {
    setFormData((prev) => ({
      ...prev,
      featured_image_url: file.file_url,
    }));
    setShowImageUpload(false);
    toast({
      title: "Image Uploaded!",
      description: "Project image has been uploaded successfully.",
      variant: "success",
    });
  };

  const handleMediaUploadError = (error: string) => {
    toast({
      title: "Upload Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "Create Project" : "Edit Project"}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Add a new project to your portfolio with complete information."
              : "Update project information and details."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Landing Page</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="info">Project Info</TabsTrigger>
                <TabsTrigger value="seo">SEO Meta</TabsTrigger>
              </TabsList>

              {/* Tab 1: Landing Page Information */}
              <TabsContent value="basic" className="space-y-6 mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Project Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Enter project name"
                      required
                    />
                  </div>

                  {/* Project Slug */}
                  <div className="space-y-2">
                    <Label htmlFor="slug">Project Slug *</Label>
                    <SlugInput
                      value={formData.slug}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, slug: value }))
                      }
                      placeholder="project-slug"
                      entityType="project"
                    />
                  </div>

                  {/* Description for Landing */}
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Landing Page Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Brief description shown on landing page..."
                      rows={4}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be displayed on the landing page projects section
                    </p>
                  </div>

                  {/* Featured Image Section */}
                  <div className="md:col-span-2 space-y-4">
                    <Label>Featured Image for Landing Page</Label>
                    
                    {/* Current Image Preview */}
                    {formData.featured_image_url && (
                      <div className="relative w-full max-w-md">
                        <Image
                          src={formData.featured_image_url}
                          alt="Featured image preview"
                          width={400}
                          height={200}
                          className="rounded-lg border object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              featured_image_url: "",
                            }))
                          }
                        >
                          <IconX className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {/* Upload Button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowImageUpload(!showImageUpload)}
                      className="w-full sm:w-auto"
                    >
                      <IconUpload className="h-4 w-4 mr-2" />
                      Upload Featured Image
                    </Button>

                    {/* Image Upload Dialog */}
                    {showImageUpload && (
                      <div className="border rounded-lg p-4 bg-muted/50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Upload Featured Image</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowImageUpload(false)}
                          >
                            <IconX className="h-4 w-4" />
                          </Button>
                        </div>
                        <MediaUpload
                          folder="project-media"
                          allowedTypes={["image/*"]}
                          maxFileSize={10 * 1024 * 1024} // 10MB
                          onUploadSuccess={handleMediaUploadSuccess}
                          onUploadError={handleMediaUploadError}
                          placeholder="Drag & drop featured image here or click to select"
                          accept="image/*"
                        />
                      </div>
                    )}

                    {/* Manual URL Input */}
                    <div className="space-y-2">
                      <Label htmlFor="featured_image_url">Or enter image URL</Label>
                      <Input
                        id="featured_image_url"
                        type="url"
                        value={formData.featured_image_url}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            featured_image_url: e.target.value,
                          }))
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  {/* Is Featured */}
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <Checkbox
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_featured: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="is_featured">Make project featured on landing page</Label>
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Project Overview with Markdown */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="space-y-6">
                  {/* Project Overview Content */}
                  <div className="space-y-2">
                    <Label>Project Overview Content</Label>
                    <p className="text-sm text-muted-foreground">
                      Write detailed project overview using Markdown. This will be displayed in the detail page.
                    </p>
                    <MarkdownEditor
                      value={formData.short_description}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          short_description: value,
                        }))
                      }
                      placeholder="Write your project overview here using Markdown..."
                    />
                  </div>

                  {/* Gallery Images Placeholder */}
                  <div className="space-y-4">
                    <Label>Project Gallery</Label>
                    <p className="text-sm text-muted-foreground">
                      Upload multiple images for the project gallery displayed in detail page.
                    </p>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <IconUpload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Gallery upload feature will be implemented soon
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          For now, use featured image in Landing Page tab
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tab 3: Project Information */}
              <TabsContent value="info" className="space-y-6 mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Short Description */}
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          short_description: e.target.value,
                        }))
                      }
                      placeholder="Brief project summary for detail page sidebar..."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Used in project detail sidebar (recommended 100-150 characters)
                    </p>
                  </div>

                  {/* Technologies Used */}
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="technologies">Technologies Used</Label>
                    <Input
                      id="technologies"
                      type="text"
                      value={formData.technologies}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          technologies: e.target.value,
                        }))
                      }
                      placeholder="React, Next.js, TypeScript, Tailwind CSS"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate technologies with commas
                    </p>
                  </div>

                  {/* Client Name */}
                  <div className="space-y-2">
                    <Label htmlFor="client_name">Client Name</Label>
                    <Input
                      id="client_name"
                      type="text"
                      value={formData.client_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          client_name: e.target.value,
                        }))
                      }
                      placeholder="Client or company name"
                    />
                  </div>

                  {/* Project Date */}
                  <div className="space-y-2">
                    <Label htmlFor="project_date">Project Date</Label>
                    <Input
                      id="project_date"
                      type="text"
                      value={formData.project_date}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          project_date: e.target.value,
                        }))
                      }
                      placeholder="January 2024"
                    />
                  </div>

                  {/* Project Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="project_duration">Project Duration</Label>
                    <Input
                      id="project_duration"
                      type="text"
                      value={formData.project_duration}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          project_duration: e.target.value,
                        }))
                      }
                      placeholder="3 months"
                    />
                  </div>

                  {/* Team Size */}
                  <div className="space-y-2">
                    <Label htmlFor="team_size">Team Size</Label>
                    <Input
                      id="team_size"
                      type="text"
                      value={formData.team_size}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          team_size: e.target.value,
                        }))
                      }
                      placeholder="5 developers"
                    />
                  </div>

                  {/* Project Status */}
                  <div className="space-y-2">
                    <Label htmlFor="project_status">Project Status</Label>
                    <Input
                      id="project_status"
                      type="text"
                      value={formData.project_status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          project_status: e.target.value,
                        }))
                      }
                      placeholder="Completed"
                    />
                  </div>

                  {/* Project URL */}
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="project_url">Project URL (Optional)</Label>
                    <Input
                      id="project_url"
                      type="url"
                      value={formData.project_url}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          project_url: e.target.value,
                        }))
                      }
                      placeholder="https://project-url.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Live project URL if available
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* SEO & Meta Tab */}
              <TabsContent value="seo" className="space-y-6 mt-6">
                <div className="grid gap-6">
                  {/* Meta Title */}
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      type="text"
                      value={formData.meta_title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          meta_title: e.target.value,
                        }))
                      }
                      placeholder="Project Name - PT Sapujagat Nirmana Tekna"
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: 50-60 characters for optimal SEO
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          meta_description: e.target.value,
                        }))
                      }
                      placeholder="Discover our innovative project built with modern technologies..."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: 150-160 characters for optimal SEO
                    </p>
                  </div>

                  {/* Preview Card */}
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <h4 className="font-medium mb-2">Search Engine Preview</h4>
                    <div className="space-y-1">
                      <div className="text-blue-600 text-sm font-medium">
                        {formData.meta_title || formData.name || "Project Title"}
                      </div>
                      <div className="text-green-600 text-xs">
                        https://tekna.co.id/projects/{formData.slug || "project-slug"}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {formData.meta_description || 
                         formData.short_description || 
                         formData.description?.substring(0, 160) + "..." || 
                         "Project description will appear here..."}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {mode === "create" ? "Create Project" : "Update Project"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
