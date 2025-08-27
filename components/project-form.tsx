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
import {
  IconLoader2,
  IconX,
  IconUpload,
} from "@tabler/icons-react";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import { mutate as globalMutate } from "swr";
import { MediaUpload } from "@/components/media-upload";
import type { MediaFile } from "@/lib/services/media.service";
import { useToast } from "@/hooks/use-toast";

interface ProjectFormData {
  name: string;
  slug: string;
  project_url: string;
  description: string;
  featured_image_url: string;
  is_featured: boolean;
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
  });

  const { toast } = useToast();

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
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
        interface _P { id: string; name: string; description?: string; featured_image_url?: string; is_featured?: boolean; is_active?: boolean }

        globalMutate(
          "/api/projects",
          async (current: { data?: _P[] } | undefined) => {
            const existing = (current?.data as _P[]) || [];
            return { success: true, data: [optimisticProject as _P, ...existing] };
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

  // Remove featured image
  const removeFeaturedImage = () => {
    setFormData((prev) => ({
      ...prev,
      featured_image_url: "",
    }));
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Complete the project information correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Example: Modern E-commerce Website"
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }))
                  }
                  placeholder="website-e-commerce-modern"
                />
                <p className="text-xs text-muted-foreground">
                  URL slug will be automatically generated from the project name
                </p>
              </div>

              {/* Project Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Complete description about this project..."
                  rows={4}
                />
              </div>

              {/* Project URL */}
              <div className="space-y-2">
                <Label htmlFor="project_url">Project URL</Label>
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
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Featured Image Upload */}
            <div className="space-y-4">
              <Label htmlFor="featured_image">Featured Project Image</Label>
              
              {/* Current Image Display */}
              {formData.featured_image_url && (
                <div className="relative">
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={formData.featured_image_url}
                      alt="Featured project image"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={removeFeaturedImage}
                      aria-label="Remove image"
                    >
                      <IconX className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Image has been selected. Click remove to change image
                  </p>
                </div>
              )}

              {/* Upload Button */}
              {!formData.featured_image_url && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowImageUpload(true)}
                    className="w-full"
                  >
                    <IconUpload className="h-4 w-4 mr-2" />
                    Upload Project Image
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Upload project image (JPG, PNG, WebP, SVG - max 5MB)
                  </p>
                </div>
              )}

              {/* Image Upload Dialog */}
              {showImageUpload && (
                <div
                  className="border rounded-lg p-4 bg-muted/50"
                  role="dialog"
                  aria-labelledby="upload-dialog-title"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 id="upload-dialog-title" className="font-medium">
                      Upload Project Image
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowImageUpload(false)}
                      aria-label="Close upload dialog"
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
                    placeholder="Drag & drop project image here or click to select"
                    accept="image/*"
                  />
                </div>
              )}

              {/* Manual URL Input */}
              <div className="space-y-2">
                <Label htmlFor="featured_image_url">
                  Or enter a manual image URL
                </Label>
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
                <p className="text-xs text-muted-foreground">
                  Optional: You can enter an external image URL as an alternative to upload
                </p>
              </div>

              {/* Is Featured */}
              <div className="flex items-center space-x-2">
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
                <Label htmlFor="is_featured">Make project featured</Label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
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
