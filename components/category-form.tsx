'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ClientDashboardService } from '@/lib/services/client-dashboard.service';
import { IconDeviceFloppy, IconX, IconPalette } from '@tabler/icons-react';
import { useToast } from '@/hooks/use-toast'

interface CategoryFormProps {
  categoryId?: string;
  initialData?: {
    name: string;
    slug: string;
    description: string;
    color: string;
    is_active: boolean;
    sort_order: number;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  color: string;
  is_active: boolean;
  sort_order: number;
}

interface ValidationErrors {
  name?: string;
  slug?: string;
  color?: string;
  sort_order?: string;
}

export function CategoryForm({ categoryId, initialData, onSuccess, onCancel }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    color: initialData?.color || '#3B82F6',
    is_active: initialData?.is_active ?? true,
    sort_order: initialData?.sort_order || 0,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { toast } = useToast()

  // Auto-generate slug when name changes
  useEffect(() => {
    if (formData.name && !categoryId) {
      const autoSlug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.name, categoryId]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nama kategori wajib diisi';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nama kategori minimal 2 karakter';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Nama kategori maksimal 100 karakter';
    }

    // Slug validation
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug wajib diisi';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung';
    } else if (formData.slug.length < 2) {
      newErrors.slug = 'Slug minimal 2 karakter';
    } else if (formData.slug.length > 100) {
      newErrors.slug = 'Slug maksimal 100 karakter';
    }

    // Color validation
    if (!formData.color) {
      newErrors.color = 'Warna wajib dipilih';
    } else if (!/^#[0-9A-F]{6}$/i.test(formData.color)) {
      newErrors.color = 'Format warna tidak valid (gunakan hex color)';
    }

    // Sort order validation
    if (formData.sort_order < 0) {
      newErrors.sort_order = 'Urutan tidak boleh negatif';
    } else if (formData.sort_order > 999) {
      newErrors.sort_order = 'Urutan maksimal 999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (categoryId) {
        await ClientDashboardService.updateCategory(categoryId, formData);
        toast({
          title: "Category Updated!",
          description: "Category has been updated successfully.",
          variant: "success",
        })
      } else {
        await ClientDashboardService.createCategory(formData);
        toast({
          title: "Category Created!",
          description: "Category has been created successfully.",
          variant: "success",
        })
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard/categories');
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconPalette className="h-5 w-5" />
          {categoryId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kategori *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Masukkan nama kategori"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="url-friendly-slug"
              className={errors.slug ? 'border-destructive' : ''}
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug}</p>
            )}
            <p className="text-sm text-muted-foreground">
              URL kategori: /blog/category/{formData.slug}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Deskripsi kategori (opsional)"
              rows={3}
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">Warna *</Label>
            <div className="flex items-center gap-3">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className={errors.color ? 'border-destructive' : ''}
              />
              <Input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="#3B82F6"
                className={errors.color ? 'border-destructive' : ''}
              />
            </div>
            {errors.color && (
              <p className="text-sm text-destructive">{errors.color}</p>
            )}
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label htmlFor="sort_order">Urutan</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
              max="999"
              className={errors.sort_order ? 'border-destructive' : ''}
            />
            {errors.sort_order && (
              <p className="text-sm text-destructive">{errors.sort_order}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Urutan untuk mengatur posisi kategori (0 = paling atas)
            </p>
          </div>

          {/* Is Active */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', !!checked)}
            />
            <Label htmlFor="is_active">Kategori Aktif</Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1"
            >
              <IconX className="h-4 w-4 mr-2" />
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              <IconDeviceFloppy className="h-4 w-4 mr-2" />
              {isLoading 
                ? (categoryId ? 'Menyimpan...' : 'Membuat...') 
                : (categoryId ? 'Simpan Perubahan' : 'Buat Kategori')
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}