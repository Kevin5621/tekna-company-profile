"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import { IconDeviceFloppy, IconX, IconPalette } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { SlugInput } from "@/components/ui/slug-input";

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

export function CategoryForm({
  categoryId,
  initialData,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    color: initialData?.color || "#3B82F6",
    is_active: initialData?.is_active ?? true,
    sort_order: initialData?.sort_order || 0,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { toast } = useToast();



  // Validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Category name must be at most 100 characters";
    }

    // Slug validation
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    // Color validation
    if (!formData.color) {
      newErrors.color = "Color is required";
    } else if (!/^#[0-9A-F]{6}$/i.test(formData.color)) {
      newErrors.color = "Invalid color format (use hex color)";
    }

    // Sort order validation
    if (formData.sort_order < 0) {
      newErrors.sort_order = "Order cannot be negative";
    } else if (formData.sort_order > 999) {
      newErrors.sort_order = "Order maximum is 999";
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
        });
      } else {
        await ClientDashboardService.createCategory(formData);
        toast({
          title: "Category Created!",
          description: "Category has been created successfully.",
          variant: "success",
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/categories");
        router.refresh();
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
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
          {categoryId ? "Edit Category" : "Add New Category"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter category name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <SlugInput
              value={formData.slug}
              onChange={(value) => handleInputChange("slug", value)}
              entityType="category"
              excludeId={categoryId}
              label="Slug"
              placeholder="url-friendly-slug"
              description="URL kategori: /blog/category/{formData.slug}"
              required
              autoGenerate
              sourceField="name"
              sourceValue={formData.name}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Category description (optional)"
              rows={3}
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">Color *</Label>
            <div className="flex items-center gap-3">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className={errors.color ? "border-destructive" : ""}
              />
              <Input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                placeholder="#3B82F6"
                className={errors.color ? "border-destructive" : ""}
              />
            </div>
            {errors.color && (
              <p className="text-sm text-destructive">{errors.color}</p>
            )}
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label htmlFor="sort_order">Order</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) =>
                handleInputChange("sort_order", parseInt(e.target.value) || 0)
              }
              placeholder="0"
              min="0"
              max="999"
              className={errors.sort_order ? "border-destructive" : ""}
            />
            {errors.sort_order && (
              <p className="text-sm text-destructive">{errors.sort_order}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Order to set category position (0 = topmost)
            </p>
          </div>

          {/* Is Active */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                handleInputChange("is_active", !!checked)
              }
            />
            <Label htmlFor="is_active">Active Category</Label>
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
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              <IconDeviceFloppy className="h-4 w-4 mr-2" />
              {isLoading
                ? categoryId
                  ? "Saving..."
                  : "Creating..."
                : categoryId
                ? "Save Changes"
                : "Create Category"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
