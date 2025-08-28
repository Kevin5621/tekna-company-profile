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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";
import { FooterService } from "@/lib/services/footer";
import { FooterLink, FooterSection } from "@/lib/services/footer";
import { toast } from "sonner";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import BackButton from "@/components/ui/back-button";

export default function FooterLinksPage() {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
  const [formData, setFormData] = useState({
    footer_section_id: "",
    title: "",
    url: "",
    icon: "",
    is_external: false,
    sort_order: 0,
    is_active: true,
  });

  const footerService = useMemo(() => new FooterService(), []);

  const loadData = useCallback(async () => {
    try {
      const [linksData, sectionsData] = await Promise.all([
        footerService.getFooterLinks(),
        footerService.getFooterSections(),
      ]);
      setLinks(linksData);
      setSections(sectionsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load footer links");
    } finally {
      setLoading(false);
    }
  }, [footerService]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingLink) {
        await footerService.updateFooterLink(editingLink.id, formData);
        toast.success("Link updated successfully");
      } else {
        await footerService.createFooterLink(formData);
        toast.success("Link created successfully");
      }

      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Error saving link:", error);
      toast.error("Failed to save link");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      await footerService.deleteFooterLink(id);
      toast.success("Link deleted successfully");
      loadData();
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Failed to delete link");
    }
  };

  const resetForm = () => {
    setFormData({
      footer_section_id: "",
      title: "",
      url: "",
      icon: "",
      is_external: false,
      sort_order: 0,
      is_active: true,
    });
    setEditingLink(null);
  };

  const openEditDialog = (link: FooterLink) => {
    setEditingLink(link);
    setFormData({
      footer_section_id: link.footer_section_id,
      title: link.title,
      url: link.url,
      icon: link.icon || "",
      is_external: link.is_external,
      sort_order: link.sort_order,
      is_active: link.is_active,
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const getSectionName = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    return section?.name || "Unknown Section";
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
          { label: "Links", href: "/dashboard/footer/links" },
          { label: "Manajemen Links", isCurrentPage: true },
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/footer" label="Back to Footer" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Footer Links</h1>
          <p className="text-muted-foreground">
            Manage links within footer sections
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Edit Link" : "Create New Link"}
            </DialogTitle>
            <DialogDescription>
              {editingLink
                ? "Update the link details below"
                : "Fill in the details to create a new footer link"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="footer_section_id">Section</Label>
                <Select
                  value={formData.footer_section_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      footer_section_id: value,
                    }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter link title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="Enter URL"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon (optional)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  placeholder="Enter icon name (lucide-react)"
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
                  id="is_external"
                  checked={formData.is_external}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_external: checked }))
                  }
                />
                <Label htmlFor="is_external">External Link</Label>
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
              <Button type="submit">{editingLink ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {links.map((link) => (
          <Card key={link.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {link.is_external ? (
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <LinkIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                    <CardDescription>
                      Section: {getSectionName(link.footer_section_id)} • Order:{" "}
                      {link.sort_order}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={link.is_active ? "default" : "secondary"}>
                    {link.is_active ? "Active" : "Inactive"}
                  </Badge>
                  {link.is_external && (
                    <Badge variant="outline">External</Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(link)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(link.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">URL:</span>{" "}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {link.url}
                  </a>
                </div>
                {link.icon && (
                  <div className="text-sm">
                    <span className="font-medium">Icon:</span> {link.icon}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(link.created_at).toLocaleDateString()}
                  {link.updated_at && (
                    <>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      Updated: {new Date(link.updated_at).toLocaleDateString()}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {links.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <LinkIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No footer links found
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first footer link
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Create Link
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
