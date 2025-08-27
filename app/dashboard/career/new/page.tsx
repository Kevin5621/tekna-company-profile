"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Eye } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import {
  CareerService,
  CareerCategory,
  CareerLocation,
  CareerType,
  CareerLevel,
} from "@/lib/services/career";
import { useToast } from "@/hooks/use-toast";
import { DashboardFormTemplate } from "@/components/dashboard/dashboard-form-template";

export default function NewCareerPositionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CareerCategory[]>([]);
  const [locations, setLocations] = useState<CareerLocation[]>([]);
  const [types, setTypes] = useState<CareerType[]>([]);
  const [levels, setLevels] = useState<CareerLevel[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    salary_min: "",
    salary_max: "",
    currency: "USD",
    category_id: "",
    location_id: "",
    type_id: "",
    level_id: "",
    experience_years: "",
    status: "draft" as "draft" | "open" | "closed" | "filled",
    featured: false,
    urgent: false,
    remote_friendly: false,
  });

  const careerService = useMemo(() => new CareerService(), []);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, locationsData, typesData, levelsData] =
          await Promise.all([
            careerService.getAllCategories(),
            careerService.getAllLocations(),
            careerService.getAllTypes(),
            careerService.getAllLevels(),
          ]);
        setCategories(categoriesData);
        setLocations(locationsData);
        setTypes(typesData);
        setLevels(levelsData);
      } catch (error) {
        console.error("Failed to load form data:", error);
        toast({
          title: "Error",
          description: "Failed to load form data",
          variant: "destructive",
        });
      }
    };
    loadData();
  }, [careerService, toast]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, status?: string) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        status: (status || formData.status) as
          | "draft"
          | "open"
          | "closed"
          | "filled",
        salary_min: formData.salary_min
          ? parseInt(formData.salary_min)
          : undefined,
        salary_max: formData.salary_max
          ? parseInt(formData.salary_max)
          : undefined,
        experience_years: formData.experience_years
          ? parseInt(formData.experience_years)
          : undefined,
      };

      const result = await careerService.createPosition(submitData);

      if (result) {
        toast({
          title: "Position Created!",
          description: `Position ${
            status === "open" ? "created and published" : "saved as draft"
          } successfully`,
          variant: "success",
        });
        router.push("/dashboard/career");
      } else {
        throw new Error("Failed to create position");
      }
    } catch (error) {
      console.error("Failed to create position:", error);
      toast({
        title: "Error",
        description: "Failed to create position",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardFormTemplate
      breadcrumbs={[
        { label: "Karir", href: "/dashboard/career" },
        { label: "Tambah Posisi Baru", isCurrentPage: true },
      ]}
      title="Tambah Posisi Baru"
      description="Buat posisi karir baru untuk perusahaan"
      backHref="/dashboard/career"
      backLabel="Kembali ke Career"
    >
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential details about the position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Position Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="auto-generated-from-title"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the role, company, and what you're looking for..."
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category_id: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select
                  value={formData.location_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, location_id: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Employment Type</Label>
                <Select
                  value={formData.type_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type_id: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Experience Level</Label>
                <Select
                  value={formData.level_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, level_id: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Information</CardTitle>
            <CardDescription>
              Requirements, responsibilities, and benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    requirements: e.target.value,
                  }))
                }
                placeholder="List the required skills, experience, and qualifications..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">Responsibilities</Label>
              <Textarea
                id="responsibilities"
                value={formData.responsibilities}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    responsibilities: e.target.value,
                  }))
                }
                placeholder="Describe the main responsibilities and duties..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits</Label>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    benefits: e.target.value,
                  }))
                }
                placeholder="List the benefits, perks, and compensation details..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary_min">Minimum Salary</Label>
                <Input
                  id="salary_min"
                  type="number"
                  value={formData.salary_min}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salary_min: e.target.value,
                    }))
                  }
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_max">Maximum Salary</Label>
                <Input
                  id="salary_max"
                  type="number"
                  value={formData.salary_max}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salary_max: e.target.value,
                    }))
                  }
                  placeholder="80000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, currency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="IDR">IDR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                type="number"
                value={formData.experience_years}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experience_years: e.target.value,
                  }))
                }
                placeholder="3"
                min="0"
                max="50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Position Settings</CardTitle>
            <CardDescription>
              Publication status and special flags
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as "draft" | "open" | "closed" | "filled",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="filled">Filled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured Position</Label>
                  <p className="text-sm text-muted-foreground">
                    Display this position prominently on the careers page
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, featured: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="urgent">Urgent Hiring</Label>
                  <p className="text-sm text-muted-foreground">
                    Mark this position as urgent to hire
                  </p>
                </div>
                <Switch
                  id="urgent"
                  checked={formData.urgent}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, urgent: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="remote_friendly">Remote Friendly</Label>
                  <p className="text-sm text-muted-foreground">
                    This position supports remote work
                  </p>
                </div>
                <Switch
                  id="remote_friendly"
                  checked={formData.remote_friendly}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      remote_friendly: checked,
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/dashboard/career">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            onClick={(e) => handleSubmit(e, "draft")}
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, "open")}
            disabled={loading}
          >
            <Eye className="mr-2 h-4 w-4" />
            Publish Position
          </Button>
        </div>
      </form>
    </DashboardFormTemplate>
  );
}
