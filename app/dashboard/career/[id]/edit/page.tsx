"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
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

import {
  CareerService,
  CareerCategory,
  CareerLocation,
  CareerType,
  CareerLevel,
} from "@/lib/services/career";
import { useToast } from "@/hooks/use-toast";
import { DashboardFormTemplate } from "@/components/dashboard/dashboard-form-template";
import { SlugInput } from "@/components/ui/slug-input";

interface CareerPosition {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  requirements: string;
  benefits: string;
  category_id: string;
  location_id: string;
  type_id: string;
  level_id: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  salary_type: string;
  application_deadline: string;
  start_date: string;
  remote_allowed: boolean;
  travel_required: boolean;
  travel_percentage: number;
  featured: boolean;
  urgent: boolean;
  status: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
}

export default function EditCareerPositionPage() {
  const router = useRouter();
  const params = useParams();
  const positionId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CareerCategory[]>([]);
  const [locations, setLocations] = useState<CareerLocation[]>([]);
  const [types, setTypes] = useState<CareerType[]>([]);
  const [levels, setLevels] = useState<CareerLevel[]>([]);
  const [formData, setFormData] = useState<CareerPosition>({
    id: "",
    title: "",
    slug: "",
    summary: "",
    description: "",
    requirements: "",
    benefits: "",
    category_id: "",
    location_id: "",
    type_id: "",
    level_id: "",
    salary_min: 0,
    salary_max: 0,
    salary_currency: "IDR",
    salary_type: "monthly",
    application_deadline: "",
    start_date: "",
    remote_allowed: false,
    travel_required: false,
    travel_percentage: 0,
    featured: false,
    urgent: false,
    status: "draft",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
  });

  const careerService = useMemo(() => new CareerService(), []);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          categoriesData,
          locationsData,
          typesData,
          levelsData,
          positionData
        ] = await Promise.all([
          careerService.getAllCategories(),
          careerService.getAllLocations(),
          careerService.getAllTypes(),
          careerService.getAllLevels(),
          careerService.getPositionById(positionId)
        ]);

        setCategories(categoriesData);
        setLocations(locationsData);
        setTypes(typesData);
        setLevels(levelsData);

        if (positionData) {
          // Ensure all fields have safe default values to prevent null/undefined errors
          setFormData({
            ...positionData,
            summary: positionData.summary || "",
            requirements: positionData.requirements || "",
            benefits: positionData.benefits || "",
            application_deadline: positionData.application_deadline || "",
            start_date: positionData.start_date || "",
            seo_title: positionData.seo_title || "",
            seo_description: positionData.seo_description || "",
            seo_keywords: positionData.seo_keywords || "",
            salary_min: positionData.salary_min || 0,
            salary_max: positionData.salary_max || 0,
            travel_percentage: positionData.travel_percentage || 0,
          });
        }
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
  }, [careerService, toast, positionId]);

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
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
          ? parseInt(formData.salary_min.toString())
          : undefined,
        salary_max: formData.salary_max
          ? parseInt(formData.salary_max.toString())
          : undefined,
        experience_years: formData.travel_percentage
          ? parseInt(formData.travel_percentage.toString())
          : undefined,
      };

      const result = await careerService.updatePosition(positionId, submitData);

      if (result) {
        toast({
          title: "Position Updated!",
          description: `Position ${
            status === "open" ? "updated and published" : "updated successfully"
          }`,
          variant: "success",
        });
        router.push("/dashboard/career");
      } else {
        throw new Error("Failed to update position");
      }
    } catch (error) {
      console.error("Failed to update position:", error);
      toast({
        title: "Error",
        description: "Failed to update position",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this position?")) {
      return;
    }

    setLoading(true);
    try {
      const result = await careerService.deletePosition(positionId);
      if (result) {
        toast({
          title: "Position Deleted!",
          description: "Career position deleted successfully",
          variant: "success",
        });
        router.push("/dashboard/career");
      }
    } catch (error) {
      console.error("Failed to delete position:", error);
      toast({
        title: "Error",
        description: "Failed to delete position",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardFormTemplate
      breadcrumbs={[
        { label: "Career", href: "/dashboard/career" },
        { label: "Edit Position", isCurrentPage: true },
      ]}
      title="Edit Career Position"
      description="Update the career position information"
      backHref="/dashboard/career"
      backLabel="Back to Career"
    >
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the basic information for this position
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
                <SlugInput
                  value={formData.slug}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, slug: value }))
                  }
                  entityType="career"
                  excludeId={positionId}
                  label="URL Slug"
                  placeholder="auto-generated-from-title"
                  autoGenerate
                  sourceField="title"
                  sourceValue={formData.title}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Job Summary</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    summary: e.target.value,
                  }))
                }
                placeholder="Brief summary of the position..."
                rows={3}
              />
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
                  placeholder="Job requirements and qualifications..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits & Perks</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      benefits: e.target.value,
                    }))
                  }
                  placeholder="Benefits, perks, and what you offer..."
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Position Details */}
        <Card>
          <CardHeader>
            <CardTitle>Position Details</CardTitle>
            <CardDescription>
              Set the position category, location, type, and level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

        {/* Salary & Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Salary & Benefits</CardTitle>
            <CardDescription>
              Set salary range and additional benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                      salary_min: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
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
                      salary_max: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_currency">Currency</Label>
                <Select
                  value={formData.salary_currency}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      salary_currency: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IDR">IDR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="application_deadline">Application Deadline</Label>
                <Input
                  id="application_deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      application_deadline: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      start_date: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Settings</CardTitle>
            <CardDescription>
              Configure additional position settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="remote_allowed"
                  checked={formData.remote_allowed}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      remote_allowed: checked,
                    }))
                  }
                />
                <Label htmlFor="remote_allowed">Remote Work Allowed</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="travel_required"
                  checked={formData.travel_required}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      travel_required: checked,
                    }))
                  }
                />
                <Label htmlFor="travel_required">Travel Required</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: checked,
                    }))
                  }
                />
                <Label htmlFor="featured">Featured Position</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="urgent"
                  checked={formData.urgent}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      urgent: checked,
                    }))
                  }
                />
                <Label htmlFor="urgent">Urgent Position</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
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
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>
              Configure SEO metadata for this position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo_title: e.target.value,
                  }))
                }
                placeholder="SEO optimized title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_description">SEO Description</Label>
              <Textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo_description: e.target.value,
                  }))
                }
                placeholder="SEO optimized description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_keywords">SEO Keywords</Label>
              <Input
                id="seo_keywords"
                value={formData.seo_keywords}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo_keywords: e.target.value,
                  }))
                }
                placeholder="Keywords separated by commas"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/career/${positionId}`)}
              disabled={loading}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Position
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete Position
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={loading}
              variant="outline"
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              type="submit"
              onClick={(e) => handleSubmit(e, "open")}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              Update & Publish
            </Button>
          </div>
        </div>
      </form>
    </DashboardFormTemplate>
  );
}
