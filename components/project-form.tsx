"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { IconLoader2, IconArrowLeft, IconX, IconPhoto } from "@tabler/icons-react";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import { MediaUpload } from "@/components/media-upload";
import type { ProjectStatus } from "@/lib/types/dashboard";
import type { MediaFile } from "@/lib/services/media.service";

interface ProjectFormData {
  name: string;
  slug: string;
  project_url: string;
  status: ProjectStatus;
  featured_image_url: string;
  is_featured: boolean;
}

interface ProjectFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<ProjectFormData>;
  projectId?: string;
}

export function ProjectForm({ mode, initialData, projectId }: Readonly<ProjectFormProps>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    project_url: initialData?.project_url || '',
    status: initialData?.status || 'planning',
    featured_image_url: initialData?.featured_image_url || '',
    is_featured: initialData?.is_featured || false,
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'create') {
        await ClientDashboardService.createProject({
          name: formData.name,
          slug: formData.slug,
          project_url: formData.project_url || undefined,
          status: formData.status,
          featured_image_url: formData.featured_image_url || undefined,
          is_featured: formData.is_featured,
        });
      } else if (mode === 'edit' && projectId) {
        await ClientDashboardService.updateProject(projectId, {
          name: formData.name,
          slug: formData.slug,
          project_url: formData.project_url || undefined,
          status: formData.status,
          featured_image_url: formData.featured_image_url || undefined,
          is_featured: formData.is_featured,
        });
      }

      router.push('/dashboard/projects');
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(mode === 'create' ? 'Failed to create project' : 'Failed to update project');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle media upload success
  const handleMediaUploadSuccess = (file: MediaFile) => {
    setFormData(prev => ({
      ...prev,
      featured_image_url: file.file_url
    }));
    setShowImageUpload(false);
  };

  // Handle media upload error with better UX
  const handleMediaUploadError = (error: string) => {
    console.error('Media upload error:', error);
    
    // Show user-friendly error messages
    let userFriendlyMessage = error;
    if (error.includes('row-level security policy')) {
      userFriendlyMessage = 'Anda tidak memiliki izin untuk mengupload file. Pastikan Anda sudah login dengan akun yang tepat.';
    } else if (error.includes('too large')) {
      userFriendlyMessage = 'File terlalu besar. Maksimal ukuran file 10MB untuk gambar proyek.';
    } else if (error.includes('not supported')) {
      userFriendlyMessage = 'Format file tidak didukung. Gunakan format JPG, PNG, GIF, atau WebP.';
    } else if (error.includes('network') || error.includes('fetch')) {
      userFriendlyMessage = 'Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.';
    }
    
    // Use toast notification instead of alert for better UX
    // For now using alert, but can be replaced with toast library
    alert(`Upload gagal: ${userFriendlyMessage}`);
  };

  // Remove featured image
  const removeFeaturedImage = () => {
    setFormData(prev => ({
      ...prev,
      featured_image_url: ''
    }));
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <IconArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {mode === 'create' ? 'Add New Project' : 'Edit Project'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'create' 
                  ? 'Create a new project for company portfolio'
                  : 'Update project information'
                }
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-4 lg:px-6">
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
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="website-e-commerce-modern"
                      />
                      <p className="text-xs text-muted-foreground">
                        URL slug akan dibuat otomatis dari nama proyek
                      </p>
                    </div>



                    {/* Status */}
                    <div className="space-y-2">
                      <Label htmlFor="status">Status Proyek *</Label>
                      <Select 
                        value={formData.status} 
                                                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as ProjectStatus }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Perencanaan</SelectItem>
                          <SelectItem value="in-progress">Sedang Berjalan</SelectItem>
                          <SelectItem value="completed">Selesai</SelectItem>
                          <SelectItem value="on-hold">Ditunda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>



                    {/* URL Proyek */}
                    <div className="space-y-2">
                      <Label htmlFor="project_url">URL Proyek</Label>
                      <Input
                        id="project_url"
                        type="url"
                        value={formData.project_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                        placeholder="https://example.com"
                      />
                    </div>


                  </div>

                  {/* Featured Image Upload */}
                  <div className="space-y-4">
                    <Label htmlFor="featured-image-section">Gambar Unggulan Proyek</Label>
                    
                    {formData.featured_image_url ? (
                      <div className="space-y-2">
                        <div className="relative group border-2 border-dashed border-border rounded-lg p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={formData.featured_image_url}
                                alt="Preview gambar proyek"
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                              <div className="fallback-icon absolute inset-0 hidden items-center justify-center">
                                <IconPhoto className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                Gambar telah dipilih
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Klik hapus untuk mengganti gambar
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={removeFeaturedImage}
                              aria-label="Hapus gambar unggulan"
                            >
                              <IconX className="h-4 w-4 mr-2" />
                              Hapus
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowImageUpload(true)}
                            aria-label="Ganti gambar unggulan"
                          >
                            <IconPhoto className="h-4 w-4 mr-2" />
                            Ganti Gambar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div 
                          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 hover:border-input transition-colors"
                          role="button"
                          tabIndex={0}
                          onClick={() => setShowImageUpload(true)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setShowImageUpload(true);
                            }
                          }}
                          aria-label="Area upload gambar - klik untuk memilih gambar"
                        >
                          <IconPhoto className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                          <h3 className="text-lg font-medium mb-2">Belum ada gambar</h3>
                          <p className="text-muted-foreground mb-4">
                            Klik untuk upload gambar proyek ini
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowImageUpload(true);
                            }}
                            aria-label="Upload gambar proyek"
                          >
                            <IconPhoto className="h-4 w-4 mr-2" />
                            Upload Gambar
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Media Upload Component */}
                    {showImageUpload && (
                      <div className="border rounded-lg p-4 bg-muted/50" role="dialog" aria-labelledby="upload-dialog-title">
                        <div className="flex items-center justify-between mb-4">
                          <h4 id="upload-dialog-title" className="font-medium">Upload Gambar Proyek</h4>
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
                          allowedTypes={['image/*']}
                          maxFileSize={10 * 1024 * 1024} // 10MB
                          onUploadSuccess={handleMediaUploadSuccess}
                          onUploadError={handleMediaUploadError}
                          placeholder="Drag & drop gambar proyek di sini atau klik untuk memilih"
                          accept="image/*"
                        />
                      </div>
                    )}
                  </div>

                  {/* Manual URL Input (Alternative) */}
                  <div className="space-y-2">
                    <Label htmlFor="featured_image_url">Atau masukkan URL Gambar manual</Label>
                    <Input
                      id="featured_image_url"
                      type="url"
                      value={formData.featured_image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      aria-describedby="url-help-text"
                    />
                    <p id="url-help-text" className="text-xs text-muted-foreground">
                      Opsional: Anda bisa memasukkan URL gambar eksternal sebagai alternatif dari upload
                    </p>
                  </div>

                  {/* Is Featured */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: !!checked }))}
                    />
                    <Label htmlFor="is_featured">Jadikan proyek unggulan</Label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {mode === 'create' ? 'Buat Proyek' : 'Update Proyek'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
