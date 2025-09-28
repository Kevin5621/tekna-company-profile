"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DashboardPageTemplate } from "@/components/dashboard/dashboard-page-template";
import { ContentManagementService, type FAQ } from "@/lib/services/content-management.service";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, EyeOff, HelpCircle, Calendar, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FAQManagementPage() {
  const [faqItems, setFaqItems] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contentService = useMemo(() => new ContentManagementService(), []);

  const loadFAQs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contentService.getFAQs();
      setFaqItems(data);
    } catch (error) {
      console.error("Error loading FAQs:", error);
      toast({
        title: "Error",
        description: "Failed to load FAQ content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [contentService, toast]);

  useEffect(() => {
    loadFAQs();
  }, [loadFAQs]);

  const filteredItems = useMemo(() => {
    return faqItems.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [faqItems, searchTerm]);

  type CreateFAQData = Omit<FAQ, "id" | "created_at" | "updated_at">;
  
  const handleCreate = async (formData: CreateFAQData) => {
    try {
      setIsSubmitting(true);
      const newItem = await contentService.createFAQ(formData);
      if (newItem) {
        setFaqItems(prev => [...prev, newItem]);
        setIsCreateDialogOpen(false);
        toast({
          title: "Success",
          description: "FAQ created successfully",
        });
      } else {
        throw new Error("Failed to create FAQ");
      }
    } catch (error) {
      console.error("Error creating FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to create FAQ",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  type UpdateFAQData = Partial<Omit<FAQ, "id" | "created_at" | "updated_at">>;
  
  const handleUpdate = async (id: string, formData: UpdateFAQData) => {
    try {
      setIsSubmitting(true);
      const updatedItem = await contentService.updateFAQ(id, formData);
      if (updatedItem) {
        setFaqItems(prev => prev.map(item => item.id === id ? updatedItem : item));
        setIsEditDialogOpen(false);
        setEditingItem(null);
        toast({
          title: "Success",
          description: "FAQ updated successfully",
        });
      } else {
        throw new Error("Failed to update FAQ");
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to update FAQ",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await contentService.deleteFAQ(id);
      if (success) {
        setFaqItems(prev => prev.filter(item => item.id !== id));
        toast({
          title: "Success",
          description: "FAQ deleted successfully",
        });
      } else {
        throw new Error("Failed to delete FAQ");
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await handleUpdate(id, { is_active: !isActive });
  };

  const stats = {
    total: faqItems.length,
    active: faqItems.filter(item => item.is_active).length,
    inactive: faqItems.filter(item => !item.is_active).length,
    categories: [...new Set(faqItems.map(item => item.category).filter(Boolean))].length,
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading FAQs...</p>
        </div>
      );
    }
    
    if (filteredItems.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-8">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No FAQs found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No FAQs match your search." : "Get started by creating your first FAQ."}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create FAQ
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
              <CardTitle className="text-lg">{item.question}</CardTitle>
              <CardDescription>
                {item.category && (
                  <Badge variant="outline" className="mr-2">
                    {item.category}
                  </Badge>
                )}
                <Badge variant={item.is_active ? "default" : "secondary"}>
                  {item.is_active ? "Active" : "Inactive"}
                </Badge>
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
            <div className="text-sm text-muted-foreground">
              <strong>Answer:</strong> {item.answer.substring(0, 200)}
              {item.answer.length > 200 && "..."}
            </div>
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
        { label: "FAQ Management", isCurrentPage: true }
      ]}
      title="FAQ Management"
      description="Manage frequently asked questions and answers"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total FAQs</CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
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
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categories}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create FAQ</DialogTitle>
                <DialogDescription>
                  Add a new frequently asked question and answer.
                </DialogDescription>
              </DialogHeader>
              <FAQForm
                onSubmit={handleCreate}
                isSubmitting={isSubmitting}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* FAQ List */}
        <div className="grid gap-4">
          {renderContent()}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit FAQ</DialogTitle>
              <DialogDescription>
                Update the FAQ information.
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <FAQForm
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

type FAQFormData = Omit<FAQ, "id" | "created_at" | "updated_at">;

interface FAQFormProps {
  readonly initialData?: FAQ;
  readonly onSubmit: (data: FAQFormData) => void;
  readonly isSubmitting: boolean;
  readonly onCancel: () => void;
}

function FAQForm({ initialData, onSubmit, isSubmitting, onCancel }: FAQFormProps) {
  const [formData, setFormData] = useState({
    question: initialData?.question || "",
    answer: initialData?.answer || "",
    category: initialData?.category || "",
    is_active: initialData?.is_active ?? true,
    sort_order: initialData?.sort_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="question">Question</Label>
          <Input
            id="question"
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="answer">Answer</Label>
          <Textarea
            id="answer"
            value={formData.answer}
            onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
            rows={6}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Category (Optional)</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="e.g., General, Technical, Billing"
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
        <div className="grid gap-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}
