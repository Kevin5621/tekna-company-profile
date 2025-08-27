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
        const result = await ClientDashboardService.createProject({
          name: formData.name,
          slug: formData.slug,
          project_url: formData.project_url || undefined,
          description: formData.description || undefined,
          featured_image_url: formData.featured_image_url || undefined,
          is_featured: formData.is_featured,
        });
        console.log("Create result:", result);
        toast({
          title: "Project Created!",
          description: "Project has been created successfully.",
          variant: "success",
        });
        router.push("/dashboard/projects");
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
          <CardTitle>Informasi Proyek</CardTitle>
          <CardDescription>
            Lengkapi informasi proyek dengan benar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Nama Proyek */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Proyek *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Website E-commerce Modern"
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
                  URL slug akan dibuat otomatis dari nama proyek
                </p>
              </div>

              {/* Deskripsi Proyek */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Deskripsi Proyek</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Deskripsi lengkap tentang proyek ini..."
                  rows={4}
                />
              </div>

              {/* URL Proyek */}
              <div className="space-y-2">
                <Label htmlFor="project_url">URL Proyek</Label>
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
              <Label htmlFor="featured_image">Gambar Unggulan Proyek</Label>
              
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
                      aria-label="Hapus gambar"
                    >
                      <IconX className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Gambar telah dipilih. Klik hapus untuk mengganti gambar
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
                    Upload Gambar Proyek
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Upload gambar proyek (JPG, PNG, WebP, SVG - max 5MB)
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
                      Upload Gambar Proyek
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowImageUpload(false)}
                      aria-label="Tutup dialog upload"
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
                    placeholder="Drag & drop gambar proyek di sini atau klik untuk memilih"
                    accept="image/*"
                  />
                </div>
              )}

              {/* Manual URL Input */}
              <div className="space-y-2">
                <Label htmlFor="featured_image_url">
                  Atau masukkan URL Gambar manual
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
                  Opsional: Anda bisa memasukkan URL gambar eksternal
                  sebagai alternatif dari upload
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
                <Label htmlFor="is_featured">Jadikan proyek unggulan</Label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {mode === "create" ? "Buat Proyek" : "Update Proyek"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
