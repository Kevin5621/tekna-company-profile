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
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Edit, Trash2, Mail, ArrowLeft } from "lucide-react";
import { FooterService } from "@/lib/services/footer";
import { NewsletterSettings } from "@/lib/services/footer";
import { toast } from "sonner";
import Link from "next/link";

export default function NewsletterPage() {
  const [newsletterSettings, setNewsletterSettings] = useState<
    NewsletterSettings[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNewsletter, setEditingNewsletter] =
    useState<NewsletterSettings | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    success_message: "",
    button_text: "",
    placeholder_text: "",
    is_active: true,
  });

  const footerService = useMemo(() => new FooterService(), []);

  const loadNewsletterSettings = useCallback(async () => {
    try {
      const data = await footerService.getAllNewsletterSettings();
      setNewsletterSettings(data);
    } catch (error) {
      console.error("Error loading newsletter settings:", error);
      toast.error("Failed to load newsletter settings");
    } finally {
      setLoading(false);
    }
  }, [footerService]);

  useEffect(() => {
    loadNewsletterSettings();
  }, [loadNewsletterSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingNewsletter) {
        await footerService.updateNewsletterSettings(
          editingNewsletter.id,
          formData
        );
        toast.success("Newsletter settings updated successfully");
      } else {
        await footerService.createNewsletterSettings(formData);
        toast.success("Newsletter settings created successfully");
      }

      setDialogOpen(false);
      resetForm();
      loadNewsletterSettings();
    } catch (error) {
      console.error("Error saving newsletter settings:", error);
      toast.error("Failed to save newsletter settings");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this newsletter setting?"))
      return;

    try {
      await footerService.deleteNewsletterSettings(id);
      toast.success("Newsletter settings deleted successfully");
      loadNewsletterSettings();
    } catch (error) {
      console.error("Error deleting newsletter settings:", error);
      toast.error("Failed to delete newsletter settings");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      success_message: "",
      button_text: "",
      placeholder_text: "",
      is_active: true,
    });
    setEditingNewsletter(null);
  };

  const openEditDialog = (newsletter: NewsletterSettings) => {
    setEditingNewsletter(newsletter);
    setFormData({
      title: newsletter.title || "",
      description: newsletter.description || "",
      success_message: newsletter.success_message || "",
      button_text: newsletter.button_text || "",
      placeholder_text: newsletter.placeholder_text || "",
      is_active: newsletter.is_active,
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
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/footer">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Footer Management
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Newsletter Settings
            </h1>
            <p className="text-muted-foreground">
              Manage newsletter subscription configuration
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Newsletter Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingNewsletter
                  ? "Edit Newsletter Settings"
                  : "Create Newsletter Settings"}
              </DialogTitle>
              <DialogDescription>
                {editingNewsletter
                  ? "Update the newsletter configuration below"
                  : "Fill in the details to create newsletter settings"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="e.g., Subscribe to our newsletter"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Brief description about the newsletter"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="button_text">Button Text</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        button_text: e.target.value,
                      }))
                    }
                    placeholder="e.g., Subscribe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="placeholder_text">Placeholder Text</Label>
                  <Input
                    id="placeholder_text"
                    value={formData.placeholder_text}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        placeholder_text: e.target.value,
                      }))
                    }
                    placeholder="e.g., Enter your email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="success_message">Success Message</Label>
                  <Textarea
                    id="success_message"
                    value={formData.success_message}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        success_message: e.target.value,
                      }))
                    }
                    placeholder="Message shown after successful subscription"
                    rows={2}
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
                  {editingNewsletter ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {newsletterSettings.map((newsletter) => (
          <Card key={newsletter.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-xl">
                      {newsletter.title || "Newsletter Settings"}
                    </CardTitle>
                    <CardDescription>
                      {newsletter.description || "No description provided"}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={newsletter.is_active ? "default" : "secondary"}
                  >
                    {newsletter.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(newsletter)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(newsletter.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Button Text:</span>{" "}
                    {newsletter.button_text || "Not set"}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Placeholder:</span>{" "}
                    {newsletter.placeholder_text || "Not set"}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Success Message:</span>{" "}
                    {newsletter.success_message || "Not set"}
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="text-sm text-muted-foreground">
                Created: {new Date(newsletter.created_at).toLocaleDateString()}
                {newsletter.updated_at && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    Updated:{" "}
                    {new Date(newsletter.updated_at).toLocaleDateString()}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {newsletterSettings.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No newsletter settings found
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your newsletter configuration
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Create Newsletter Settings
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Newsletter Preview */}
      {newsletterSettings.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              How the newsletter section will appear in the footer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {newsletterSettings
              .filter((n) => n.is_active)
              .slice(0, 1)
              .map((newsletter) => (
                <div key={newsletter.id} className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">
                    {newsletter.title || "Newsletter"}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {newsletter.description || "Subscribe to our newsletter"}
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder={
                        newsletter.placeholder_text || "Enter your email"
                      }
                      className="flex-1"
                      disabled
                    />
                    <Button disabled>
                      {newsletter.button_text || "Subscribe"}
                    </Button>
                  </div>
                  {newsletter.success_message && (
                    <p className="text-sm text-green-600 mt-2">
                      Success: {newsletter.success_message}
                    </p>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
