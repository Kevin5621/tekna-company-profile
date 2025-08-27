"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PartnerFormData {
  name: string;
  logo_url: string;
  description: string;
  website: string;
  is_active: boolean;
}

interface PartnerFormProps {
  partnerId?: string;
}

export default function PartnerForm({ partnerId }: PartnerFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    logo_url: "",
    description: "",
    website: "",
    is_active: true,
  });

  const isEdit = Boolean(partnerId);

  // Fetch partner data for editing
  useEffect(() => {
    if (partnerId) {
      const fetchPartner = async () => {
        try {
          const response = await fetch(`/api/partners/${partnerId}`);
          const data = await response.json();

          if (data.success) {
            const partner = data.partner;
            setFormData({
              name: partner.name || "",
              logo_url: partner.logo_url || "",
              description: partner.description || "",
              website: partner.website || "",
              is_active: partner.is_active,
            });
          } else {
            throw new Error(data.error || "Failed to fetch partner");
          }
        } catch (error) {
          console.error("Error fetching partner:", error);
          toast({
            title: "Error",
            description: "Failed to fetch partner data",
            variant: "destructive",
          });
          router.push("/dashboard/partners");
        }
      };

      fetchPartner();
    }
  }, [partnerId, toast, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Partner name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const url = isEdit ? `/api/partners/${partnerId}` : "/api/partners";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Partner ${isEdit ? "updated" : "created"} successfully`,
        });
        router.push("/dashboard/partners");
      } else {
        throw new Error(
          data.error || `Failed to ${isEdit ? "update" : "create"} partner`
        );
      }
    } catch (error) {
      console.error("Error saving partner:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} partner`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof PartnerFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/partners">Partners</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isEdit ? "Edit Partner" : "New Partner"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/partners">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Partners
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Partner" : "Add New Partner"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? "Update partner information"
              : "Create a new partner with logo, name, and description"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Partner Information</CardTitle>
            <CardDescription>
              Fill in the basic information for this partner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Partner Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Partner Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter partner name"
                  required
                />
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <ImageUpload
                  value={formData.logo_url}
                  onChange={(url) => handleChange("logo_url", url)}
                  bucket="media"
                  path="partners"
                  placeholder="Upload partner logo"
                />
                <p className="text-sm text-muted-foreground">
                  Upload the partner&apos;s logo image (JPG, PNG, WebP, SVG -
                  max 5MB)
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Brief description of the partner"
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  A short description about this partner
                </p>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://partner-website.com"
                />
                <p className="text-sm text-muted-foreground">
                  Partner&apos;s official website URL
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    handleChange("is_active", checked)
                  }
                />
                <Label htmlFor="is_active">Active Partner</Label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading
                    ? "Saving..."
                    : isEdit
                    ? "Update Partner"
                    : "Create Partner"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/partners">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
