"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { SlugInput } from "@/components/ui/slug-input";
import Image from "next/image";

interface PartnerFormData {
  name: string;
  slug: string;
  logo_url: string;
  website: string;
  email: string;
  phone: string;
  industry: string;
  partnership_type: string;
  partnership_since: string;
  is_featured: boolean;
  sort_order: number;
  translations: {
    language_code: string;
    title: string;
    description: string;
    short_description: string;
    partnership_details: string;
  }[];
}

interface Language {
  id: string;
  code: string;
  name: string;
}

interface PartnerFormProps {
  partnerId?: string;
  initialData?: Partial<PartnerFormData>;
}

const partnershipTypes = [
  { value: "client", label: "Client" },
  { value: "technology", label: "Technology Partner" },
  { value: "strategic", label: "Strategic Partner" },
  { value: "vendor", label: "Vendor" },
];

export default function PartnerForm({
  partnerId,
  initialData,
}: PartnerFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    slug: "",
    logo_url: "",
    website: "",
    email: "",
    phone: "",
    industry: "",
    partnership_type: "client",
    partnership_since: "",
    is_featured: false,
    sort_order: 0,
    translations: [],
  });

  const isEditing = Boolean(partnerId);

  useEffect(() => {
    // Fetch languages
    const fetchLanguages = async () => {
      try {
        const response = await fetch("/api/admin/languages");
        const data = await response.json();
        if (data.success) {
          setLanguages(data.languages);

          // Initialize translations for all languages if creating new partner
          if (!isEditing) {
            setFormData((prev) => ({
              ...prev,
              translations: data.languages.map((lang: Language) => ({
                language_code: lang.code,
                title: "",
                description: "",
                short_description: "",
                partnership_details: "",
              })),
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, [isEditing]);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        translations: initialData.translations || prev.translations,
      }));
    }
  }, [initialData]);



  const handleInputChange = (
    field: keyof PartnerFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTranslationChange = (
    languageCode: string,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((t) =>
        t.language_code === languageCode ? { ...t, [field]: value } : t
      ),
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.slug) {
        throw new Error("Name and slug are required");
      }

      const url = isEditing ? `/api/partners/${partnerId}` : "/api/partners";
      const method = isEditing ? "PUT" : "POST";

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
          description: `Partner ${
            isEditing ? "updated" : "created"
          } successfully`,
        });
        router.push("/dashboard/partners");
      } else {
        throw new Error(
          data.error || `Failed to ${isEditing ? "update" : "create"} partner`
        );
      }
    } catch (error) {
      console.error("Error saving partner:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : `Failed to ${isEditing ? "update" : "create"} partner`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Partner Information</CardTitle>
                <CardDescription>
                  Basic information about the partner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Partner name"
                      required
                    />
                  </div>
                  <div>
                    <SlugInput
                      value={formData.slug}
                      onChange={(value) => handleInputChange("slug", value)}
                      entityType="partner"
                      excludeId={partnerId}
                      label="Slug"
                      placeholder="partner-slug"
                      required
                      autoGenerate
                      sourceField="name"
                      sourceValue={formData.name}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="contact@partner.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://partner.com"
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) =>
                      handleInputChange("industry", e.target.value)
                    }
                    placeholder="Technology, Manufacturing, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={formData.logo_url}
                    onChange={(e) =>
                      handleInputChange("logo_url", e.target.value)
                    }
                    placeholder="/images/partners/logo.png"
                  />
                  {formData.logo_url && (
                    <div className="mt-2">
                      <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={formData.logo_url}
                          alt="Partner logo"
                          fill
                          className="object-contain p-2"
                          sizes="96px"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Partner display and categorization settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="partnership_type">Partnership Type</Label>
                  <Select
                    value={formData.partnership_type}
                    onValueChange={(value) =>
                      handleInputChange("partnership_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {partnershipTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="partnership_since">Partnership Since</Label>
                  <Input
                    id="partnership_since"
                    type="date"
                    value={formData.partnership_since}
                    onChange={(e) =>
                      handleInputChange("partnership_since", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      handleInputChange(
                        "sort_order",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      handleInputChange("is_featured", checked)
                    }
                  />
                  <Label htmlFor="is_featured">Featured Partner</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Translations */}
        <Card>
          <CardHeader>
            <CardTitle>Translations</CardTitle>
            <CardDescription>
              Add content in different languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={languages[0]?.code || "en"}>
              <TabsList className="grid w-full grid-cols-2">
                {languages.map((language) => (
                  <TabsTrigger key={language.code} value={language.code}>
                    {language.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {languages.map((language) => {
                const translation = formData.translations.find(
                  (t) => t.language_code === language.code
                );

                return (
                  <TabsContent
                    key={language.code}
                    value={language.code}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor={`title_${language.code}`}>Title</Label>
                      <Input
                        id={`title_${language.code}`}
                        value={translation?.title || ""}
                        onChange={(e) =>
                          handleTranslationChange(
                            language.code,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder={`Partner title in ${language.name}`}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`short_description_${language.code}`}>
                        Short Description
                      </Label>
                      <Input
                        id={`short_description_${language.code}`}
                        value={translation?.short_description || ""}
                        onChange={(e) =>
                          handleTranslationChange(
                            language.code,
                            "short_description",
                            e.target.value
                          )
                        }
                        placeholder={`Brief description in ${language.name}`}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`description_${language.code}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`description_${language.code}`}
                        value={translation?.description || ""}
                        onChange={(e) =>
                          handleTranslationChange(
                            language.code,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder={`Full description in ${language.name}`}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`partnership_details_${language.code}`}>
                        Partnership Details
                      </Label>
                      <Textarea
                        id={`partnership_details_${language.code}`}
                        value={translation?.partnership_details || ""}
                        onChange={(e) =>
                          handleTranslationChange(
                            language.code,
                            "partnership_details",
                            e.target.value
                          )
                        }
                        placeholder={`Partnership details in ${language.name}`}
                        rows={6}
                      />
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Partner"
              : "Create Partner"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/partners">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
