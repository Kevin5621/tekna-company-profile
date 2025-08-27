"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  IconSettings,
  IconDeviceFloppy,
  IconRefresh,
  IconBuilding,
  IconGlobe,
} from "@tabler/icons-react";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";

interface CompanySettings {
  name: string;
  description: string;
  website_url: string;
  contact_email: string;
  phone: string;
  address: string;
  social_media: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  seo: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
  };
  features: {
    blog_enabled: boolean;
    newsletter_enabled: boolean;
    contact_form_enabled: boolean;
    analytics_enabled: boolean;
  };
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<CompanySettings>({
    name: "PT Sapujagat Nirmana Tekna",
    description: "Leading technology solutions provider",
    website_url: "https://tekna.com",
    contact_email: "contact@tekna.com",
    phone: "+62 21 1234 5678",
    address: "Jakarta, Indonesia",
    social_media: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
    },
    seo: {
      meta_title: "Tekna - Technology Solutions Provider",
      meta_description: "Leading technology solutions provider in Indonesia",
      meta_keywords: "technology, solutions, software, consulting",
    },
    features: {
      blog_enabled: true,
      newsletter_enabled: true,
      contact_form_enabled: true,
      analytics_enabled: true,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // TODO: Implement loading settings from database
    // For now, using default values
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement saving settings to database
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Settings saved:", settings);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    // TODO: Implement reset to default settings
    console.log("Settings reset");
  };

  const updateSettings = (path: string, value: string | boolean) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      const keys = path.split(".");
      let current: Record<string, unknown> = newSettings;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] as Record<string, unknown>;
      }

      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb
        items={[
          { label: "Pengaturan", href: "/dashboard/settings" },
          { label: "Konfigurasi Sistem", isCurrentPage: true },
        ]}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure company settings and system preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            <IconRefresh className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isLoading || isSaving}>
            <IconDeviceFloppy className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBuilding className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Basic company details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={settings.name}
                onChange={(e) => updateSettings("name", e.target.value)}
                placeholder="Company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                value={settings.website_url}
                onChange={(e) => updateSettings("website_url", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => updateSettings("description", e.target.value)}
              placeholder="Brief description of your company"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={settings.contact_email}
                onChange={(e) =>
                  updateSettings("contact_email", e.target.value)
                }
                placeholder="contact@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => updateSettings("phone", e.target.value)}
                placeholder="+62 21 1234 5678"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={(e) => updateSettings("address", e.target.value)}
              placeholder="Company address"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Social media profiles for your company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={settings.social_media.facebook}
                onChange={(e) =>
                  updateSettings("social_media.facebook", e.target.value)
                }
                placeholder="https://facebook.com/company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={settings.social_media.twitter}
                onChange={(e) =>
                  updateSettings("social_media.twitter", e.target.value)
                }
                placeholder="https://twitter.com/company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={settings.social_media.linkedin}
                onChange={(e) =>
                  updateSettings("social_media.linkedin", e.target.value)
                }
                placeholder="https://linkedin.com/company/company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={settings.social_media.instagram}
                onChange={(e) =>
                  updateSettings("social_media.instagram", e.target.value)
                }
                placeholder="https://instagram.com/company"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconGlobe className="h-5 w-5" />
            SEO Settings
          </CardTitle>
          <CardDescription>Search engine optimization settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              value={settings.seo.meta_title}
              onChange={(e) => updateSettings("seo.meta_title", e.target.value)}
              placeholder="Page title for search engines"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={settings.seo.meta_description}
              onChange={(e) =>
                updateSettings("seo.meta_description", e.target.value)
              }
              placeholder="Brief description for search engines"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_keywords">Meta Keywords</Label>
            <Input
              id="meta_keywords"
              value={settings.seo.meta_keywords}
              onChange={(e) =>
                updateSettings("seo.meta_keywords", e.target.value)
              }
              placeholder="Keywords separated by commas"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconSettings className="h-5 w-5" />
            Feature Toggles
          </CardTitle>
          <CardDescription>Enable or disable website features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Blog System</Label>
              <p className="text-sm text-muted-foreground">
                Enable blog posts and articles
              </p>
            </div>
            <Switch
              checked={settings.features.blog_enabled}
              onCheckedChange={(checked) =>
                updateSettings("features.blog_enabled", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Newsletter System</Label>
              <p className="text-sm text-muted-foreground">
                Enable newsletter subscriptions
              </p>
            </div>
            <Switch
              checked={settings.features.newsletter_enabled}
              onCheckedChange={(checked) =>
                updateSettings("features.newsletter_enabled", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Contact Form</Label>
              <p className="text-sm text-muted-foreground">
                Enable contact form submissions
              </p>
            </div>
            <Switch
              checked={settings.features.contact_form_enabled}
              onCheckedChange={(checked) =>
                updateSettings("features.contact_form_enabled", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Enable website analytics tracking
              </p>
            </div>
            <Switch
              checked={settings.features.analytics_enabled}
              onCheckedChange={(checked) =>
                updateSettings("features.analytics_enabled", checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
