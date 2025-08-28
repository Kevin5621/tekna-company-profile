"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
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
  Star,
  Edit,
  Trash2,
  Eye,
  Calendar
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
  CareerPosition,
} from "@/lib/services/career";
import { useToast } from "@/hooks/use-toast";
import { DashboardFormTemplate } from "@/components/dashboard/dashboard-form-template";
import { SlugInput } from "@/components/ui/slug-input";

export default function EditCareerPositionPage() {
  const router = useRouter();
  const params = useParams();
  const positionId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CareerCategory[]>([]);
  const [locations, setLocations] = useState<CareerLocation[]>([]);
  const [types, setTypes] = useState<CareerType[]>([]);
  const [levels, setLevels] = useState<CareerLevel[]>([]);
  const [formData, setFormData] = useState<Partial<CareerPosition>>({
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
    views_count: 0,
    applications_count: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title?.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.description?.trim()) {
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

  const handleSubmit = async (e: React.FormEvent, status?: string) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Clean formData to only include fields that exist in career_positions table
      const cleanData = {
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary || undefined,
        description: formData.description,
        requirements: formData.requirements || undefined,
        benefits: formData.benefits || undefined,
        category_id: formData.category_id,
        location_id: formData.location_id,
        type_id: formData.type_id,
        level_id: formData.level_id,
        salary_min: formData.salary_min,
        salary_max: formData.salary_max,
        salary_currency: formData.salary_currency,
        salary_type: formData.salary_type,
        application_deadline: formData.application_deadline || undefined,
        start_date: formData.start_date || undefined,
        remote_allowed: formData.remote_allowed,
        travel_required: formData.travel_required,
        travel_percentage: formData.travel_percentage,
        featured: formData.featured,
        urgent: formData.urgent,
        status: (status || formData.status) as
          | "draft"
          | "open"
          | "closed"
          | "filled",
        seo_title: formData.seo_title || undefined,
        seo_description: formData.seo_description || undefined,
        seo_keywords: formData.seo_keywords || undefined,
      };

      console.log("=== DEBUG INFO ===");
      console.log("Position ID:", positionId);
      console.log("Form Status:", formData.status);
      console.log("Passed Status:", status);
      console.log("Final Status:", status || formData.status);
      console.log("Updating position with data:", cleanData);
      console.log("=== END DEBUG ===");
      
      const result = await careerService.updatePosition(positionId, cleanData);

      if (result.success) {
        toast({
          title: "Position Updated!",
          description: `Position updated successfully with status: ${status || formData.status}`,
          variant: "success",
        });
        router.push("/dashboard/career");
      } else {
        throw new Error(result.error || "Failed to update position");
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
      backLabel="Back to Career Positions"
    >
      {/* Action Buttons Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {formData.status === "draft" ? "Draft Mode" : "Published"}
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
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Position
          </Button>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
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
                value={formData.slug || ""}
                onChange={(value) => setFormData((prev) => ({ ...prev, slug: value }))}
                entityType="career"
                excludeId={positionId}
                label="URL Slug"
                placeholder="auto-generated-from-title"
                autoGenerate
                sourceField="title"
                sourceValue={formData.title || ""}
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
                    id="remote_allowed"
                    checked={formData.remote_allowed}
                    onCheckedChange={(checked) => handleInputChange("remote_allowed", checked)}
                  />
                  <Label htmlFor="remote_allowed" className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    Remote Work Allowed
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
                    onChange={(e) => handleInputChange("salary_min", parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary_max">Max Salary</Label>
                  <Input
                    id="salary_max"
                    type="number"
                    value={formData.salary_max}
                    onChange={(e) => handleInputChange("salary_max", parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary_currency">Currency</Label>
                <Select
                  value={formData.salary_currency}
                  onValueChange={(value) => handleInputChange("salary_currency", value)}
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
              
              <div className="space-y-2">
                <Label htmlFor="travel_percentage">Travel Percentage</Label>
                <Input
                  id="travel_percentage"
                  type="number"
                  value={formData.travel_percentage}
                  onChange={(e) => handleInputChange("travel_percentage", parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  max="100"
                />
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
          {/* Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Job Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                placeholder="Brief summary of the position..."
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

        {/* Dates & Additional Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Dates */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Important Dates</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="application_deadline">Application Deadline</Label>
                <Input
                  id="application_deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) => handleInputChange("application_deadline", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange("start_date", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Additional Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="travel_required"
                  checked={formData.travel_required}
                  onCheckedChange={(checked) => handleInputChange("travel_required", checked)}
                />
                <Label htmlFor="travel_required">Travel Required</Label>
              </div>
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
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, formData.status)}
              disabled={loading}
              className="min-w-[140px]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Update Position</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </DashboardFormTemplate>
  );
}
