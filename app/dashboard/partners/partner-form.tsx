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
// removed unused form field components; this form only uses ImageUpload now
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import Link from "next/link";

interface PartnerFormData {
  logo_url: string;
}

interface PartnerFormProps {
  partnerId?: string;
}

export default function PartnerForm({ partnerId }: PartnerFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PartnerFormData>({
    logo_url: "",
  });

  const isEdit = Boolean(partnerId);

  useEffect(() => {
      if (partnerId) {
      const fetchPartner = async () => {
        try {
          const response = await fetch(`/api/partners/${partnerId}`);
          const data = await response.json();

          if (data.success) {
            const partner = data.partner;
            setFormData({
              logo_url: partner.logo_url || "",
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

    if (!formData.logo_url || !formData.logo_url.trim()) {
      toast({
        title: "Error",
        description: "Partner logo is required",
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

  const handleChange = (value: string) => {
    setFormData({ logo_url: value });
  };

  return (
    // Form content only — the surrounding page should provide DashboardFormTemplate
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Partner Information</CardTitle>
          <CardDescription>Fill in the basic information for this partner</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <ImageUpload
                value={formData.logo_url}
                onChange={(url) => handleChange(url)}
                bucket="media"
                path="partners"
                placeholder="Upload partner logo"
              />
              <p className="text-sm text-muted-foreground">
                Upload the partner logo image (JPG, PNG, WebP, SVG - max 5MB)
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : isEdit ? "Update Partner" : "Create Partner"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/partners">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
