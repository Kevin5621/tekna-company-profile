"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DashboardPageTemplate } from "@/components/dashboard/dashboard-page-template";
import { ContentManagementService, type AboutUs } from "@/lib/services/content-management.service";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, EyeOff, FileText, Calendar, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AboutUsManagementPage() {
  const [aboutUsItems, setAboutUsItems] = useState<AboutUs[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AboutUs | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contentService = useMemo(() => new ContentManagementService(), []);

  const loadAboutUs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contentService.getAboutUs();
      setAboutUsItems(data);
    } catch (error) {
      console.error("Error loading about us:", error);
      toast({
        title: "Error",
        description: "Failed to load about us content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [contentService, toast]);

  useEffect(() => {
    loadAboutUs();
  }, [loadAboutUs]);

  const filteredItems = useMemo(() => {
    return aboutUsItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [aboutUsItems, searchTerm]);

  type CreateAboutUsData = Omit<AboutUs, "id" | "created_at" | "updated_at">;
  
  const handleCreate = async (formData: CreateAboutUsData) => {
    try {
      setIsSubmitting(true);
      const newItem = await contentService.createAboutUs(formData);
      if (newItem) {
        setAboutUsItems(prev => [...prev, newItem]);
        toast({
          title: "Success",
          description: "About us content created successfully",
        });
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating about us:", error);
      toast({
        title: "Error",
        description: "Failed to create about us content",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  type UpdateAboutUsData = Partial<Omit<AboutUs, "id" | "created_at" | "updated_at">>;
  
  const handleUpdate = async (id: string, formData: UpdateAboutUsData) => {
    try {
      setIsSubmitting(true);
      const updatedItem = await contentService.updateAboutUs(id, formData);
      if (updatedItem) {
        setAboutUsItems(prev => prev.map(item => item.id === id ? updatedItem : item));
        toast({
          title: "Success",
          description: "About us content updated successfully",
        });
        setIsEditDialogOpen(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Error updating about us:", error);
      toast({
        title: "Error",
        description: "Failed to update about us content",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteAboutUs(id);
      setAboutUsItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "About us content deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting about us:", error);
      toast({
        title: "Error",
        description: "Failed to delete about us content",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await handleUpdate(id, { is_active: !isActive });
  };

  const stats = {
    total: aboutUsItems.length,
    active: aboutUsItems.filter(item => item.is_active).length,
    inactive: aboutUsItems.filter(item => !item.is_active).length,
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading content...</p>
        </div>
      );
    }
    
    if (filteredItems.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No content found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No content matches your search." : "Get started by creating your first about us content."}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }
    
    return filteredItems.map((item) => (
      <Card key={item.id}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/{item.slug}</span>
                  <Badge variant={item.is_active ? "default" : "secondary"}>
                    {item.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={item.is_active}
                onCheckedChange={() => handleToggleActive(item.id, item.is_active)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingItem(item);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {item.content && (
              <div className="text-sm text-muted-foreground">
                <strong>Content:</strong> {item.content.substring(0, 200)}
                {item.content.length > 200 && "..."}
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created: {new Date(item.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Sort Order: {item.sort_order}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <DashboardPageTemplate
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "About Us Management", isCurrentPage: true }
      ]}
      title="About Us Management"
      description="Manage about us content and company information"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactive}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create About Us Content</DialogTitle>
              <DialogDescription>
                Add new about us content to your website.
              </DialogDescription>
            </DialogHeader>
            <AboutUsForm
              onSubmit={handleCreate}
              isSubmitting={isSubmitting}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Content List */}
        <div className="grid gap-4">
          {renderContent()}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit About Us Content</DialogTitle>
              <DialogDescription>
                Update the about us content information.
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <AboutUsForm
                initialData={editingItem}
                onSubmit={(data) => handleUpdate(editingItem.id, data)}
                isSubmitting={isSubmitting}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setEditingItem(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardPageTemplate>
  );
}

type AboutUsFormData = Omit<AboutUs, "id" | "created_at" | "updated_at">;

interface AboutUsFormProps {
  readonly initialData?: AboutUs;
  readonly onSubmit: (data: AboutUsFormData) => void;
  readonly isSubmitting: boolean;
  readonly onCancel: () => void;
}

function AboutUsForm({ initialData, onSubmit, isSubmitting, onCancel }: AboutUsFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    meta_title: initialData?.meta_title || "",
    meta_description: initialData?.meta_description || "",
    meta_keywords: initialData?.meta_keywords || "",
    featured_image_url: initialData?.featured_image_url || "",
    sort_order: initialData?.sort_order || 0,
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta_title">Meta Title</Label>
        <Input
          id="meta_title"
          value={formData.meta_title}
          onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta_description">Meta Description</Label>
        <Textarea
          id="meta_description"
          value={formData.meta_description}
          onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta_keywords">Meta Keywords</Label>
        <Input
          id="meta_keywords"
          value={formData.meta_keywords}
          onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="featured_image_url">Featured Image URL</Label>
        <Input
          id="featured_image_url"
          value={formData.featured_image_url}
          onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {(() => {
            if (isSubmitting) return "Saving...";
            if (initialData) return "Update";
            return "Create";
          })()}
        </Button>
      </DialogFooter>
    </form>
  );
}