"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { FooterService } from "@/lib/services/footer";
import { FooterSection } from "@/lib/services/footer";
import { toast } from "sonner";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import BackButton from "@/components/ui/back-button";

export default function FooterSectionsPage() {
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<FooterSection | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sort_order: 0,
    is_active: true,
  });

  const footerService = useMemo(() => new FooterService(), []);

  const loadSections = useCallback(async () => {
    try {
      const data = await footerService.getFooterSections();
      setSections(data);
    } catch (error) {
      console.error("Error loading sections:", error);
      toast.error("Failed to load footer sections");
    } finally {
      setLoading(false);
    }
  }, [footerService]);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSection) {
        await footerService.updateFooterSection(editingSection.id, formData);
        toast.success("Section updated successfully");
      } else {
        await footerService.createFooterSection(formData);
        toast.success("Section created successfully");
      }

      setDialogOpen(false);
      resetForm();
      loadSections();
    } catch (error) {
      console.error("Error saving section:", error);
      toast.error("Failed to save section");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    try {
      await footerService.deleteFooterSection(id);
      toast.success("Section deleted successfully");
      loadSections();
    } catch (error) {
      console.error("Error deleting section:", error);
      toast.error("Failed to delete section");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      sort_order: 0,
      is_active: true,
    });
    setEditingSection(null);
  };

  const openEditDialog = (section: FooterSection) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      slug: section.slug,
      sort_order: section.sort_order,
      is_active: section.is_active,
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="container mx-auto py-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb
        items={[
          { label: "Footer", href: "/dashboard/footer" },
          { label: "Sections", href: "/dashboard/footer/sections" },
          { label: "Manajemen Sections", isCurrentPage: true },
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/footer" label="Back to Footer" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Footer Sections</h1>
          <p className="text-muted-foreground">
            Manage footer sections and categories
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSection ? "Edit Section" : "Create New Section"}
            </DialogTitle>
            <DialogDescription>
              {editingSection
                ? "Update the section details below"
                : "Fill in the details to create a new footer section"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter section name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="Enter section slug"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sort_order: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingSection ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{section.name}</CardTitle>
                    <CardDescription>
                      Slug: {section.slug} • Order: {section.sort_order}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={section.is_active ? "default" : "secondary"}>
                    {section.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(section)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Created: {new Date(section.created_at).toLocaleDateString()}
                {section.updated_at && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    Updated: {new Date(section.updated_at).toLocaleDateString()}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {sections.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No footer sections found
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first footer section
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Create Section
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
