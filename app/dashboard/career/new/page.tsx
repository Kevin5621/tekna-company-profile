"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Save, 
  Briefcase, 
  DollarSign, 
  Settings, 
  FileText,
  Target,
  Award,
  Globe,
  Zap,
  Building2,
  Users,
  GraduationCap,
  Star
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Badge } from "@/components/ui/badge";

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

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
    }));
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.category_id) {
      toast({
        title: "Validation Error",
        description: "Category is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.location_id) {
      toast({
        title: "Validation Error",
        description: "Location is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.type_id) {
      toast({
        title: "Validation Error",
        description: "Type is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.level_id) {
      toast({
        title: "Validation Error",
        description: "Level is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await careerService.createPosition({
        ...formData,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : 0,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : 0,
      });

      if (result) {
        toast({
          title: "Success!",
          description: "Career position created successfully",
          variant: "success",
        });
        router.push("/dashboard/career");
      } else {
        toast({
          title: "Error",
          description: "Failed to create position",
          variant: "destructive",
        });
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
        { label: "Career", href: "/dashboard/career" },
        { label: "Add New Position", isCurrentPage: true },
      ]}
      title="Create New Career Position"
      description="Add a new job opening to attract top talent"
      backHref="/dashboard/career"
      backLabel="Back to Career Positions"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information - Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Title & Slug */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </div>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Senior Frontend Developer"
                  required
                />
              </div>
              <SlugInput
                value={formData.slug}
                onChange={(value) => handleInputChange("slug", value)}
                entityType="career"
                label="URL Slug"
                placeholder="auto-generated-from-title"
                autoGenerate
                sourceField="title"
                sourceValue={formData.title}
              />
            </CardContent>
          </Card>

          {/* Status & Settings */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Status & Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
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
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                  <Label htmlFor="featured" className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Featured Position
                  </Label>
            </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="urgent"
                    checked={formData.urgent}
                    onCheckedChange={(checked) => handleInputChange("urgent", checked)}
                  />
                  <Label htmlFor="urgent" className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    Urgent Hiring
                  </Label>
            </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="remote_friendly"
                    checked={formData.remote_friendly}
                    onCheckedChange={(checked) => handleInputChange("remote_friendly", checked)}
                  />
                  <Label htmlFor="remote_friendly" className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    Remote Friendly
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Position Details - Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Category & Location */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Category & Location</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleInputChange("category_id", value)}
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
                  onValueChange={(value) => handleInputChange("location_id", value)}
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
            </CardContent>
          </Card>

          {/* Type & Level */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Type & Level</CardTitle>
            </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Employment Type *</Label>
                <Select
                  value={formData.type_id}
                  onValueChange={(value) => handleInputChange("type_id", value)}
                  required
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
                <Label htmlFor="level">Experience Level *</Label>
                <Select
                  value={formData.level_id}
                  onValueChange={(value) => handleInputChange("level_id", value)}
                  required
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
          </CardContent>
        </Card>

          {/* Salary & Experience */}
        <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Salary & Experience</CardTitle>
              </div>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
                  <Label htmlFor="salary_min">Min Salary</Label>
                <Input
                  id="salary_min"
                  type="number"
                  value={formData.salary_min}
                    onChange={(e) => handleInputChange("salary_min", e.target.value)}
                    placeholder="0"
                />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="salary_max">Max Salary</Label>
                <Input
                  id="salary_max"
                  type="number"
                  value={formData.salary_max}
                    onChange={(e) => handleInputChange("salary_max", e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange("currency", value)}
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
              

            </CardContent>
          </Card>
            </div>

        {/* Content Sections - Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Description */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Job Description *</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={8}
                required
              />
          </CardContent>
        </Card>

          {/* Requirements */}
        <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Requirements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                placeholder="List the key requirements and qualifications..."
                rows={8}
              />
            </CardContent>
          </Card>
                </div>

        {/* Additional Content - Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Responsibilities */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Responsibilities</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                id="responsibilities"
                value={formData.responsibilities}
                onChange={(e) => handleInputChange("responsibilities", e.target.value)}
                placeholder="Outline the key responsibilities and duties..."
                rows={6}
              />
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Benefits & Perks</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => handleInputChange("benefits", e.target.value)}
                placeholder="List the benefits, perks, and what you offer..."
                rows={6}
              />
          </CardContent>
        </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              {formData.status === "draft" ? "Draft Mode" : "Ready to Publish"}
            </Badge>
            {formData.featured && (
              <Badge variant="secondary" className="text-sm">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {formData.urgent && (
              <Badge variant="destructive" className="text-sm">
                <Zap className="h-3 w-3 mr-1" />
                Urgent
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
              onClick={() => router.push("/dashboard/career")}
            disabled={loading}
          >
              Cancel
          </Button>
          <Button
              type="submit"
            disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Create Position</span>
                </div>
              )}
          </Button>
          </div>
        </div>
      </form>
    </DashboardFormTemplate>
  );
}
