"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Edit, Trash2, Eye, Calendar, MapPin, Briefcase, Users, DollarSign, TrendingUp, FileText, Globe, Link } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  CareerService,
  CareerLocation,
  CareerType,
  CareerLevel,
} from "@/lib/services/career";
import { useToast } from "@/hooks/use-toast";
import { DashboardFormTemplate } from "@/components/dashboard/dashboard-form-template";

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
  views_count: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
}

export default function ViewCareerPositionPage() {
  const router = useRouter();
  const params = useParams();
  const positionId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<CareerPosition | null>(null);
  const [location, setLocation] = useState<CareerLocation | null>(null);
  const [type, setType] = useState<CareerType | null>(null);
  const [level, setLevel] = useState<CareerLevel | null>(null);

  const careerService = useMemo(() => new CareerService(), []);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const positionData = await careerService.getPositionById(positionId);
        if (positionData) {
          setPosition(positionData as CareerPosition);
          
          if (positionData.location_id) {
            const locationData = await careerService.getLocationById(positionData.location_id);
            setLocation(locationData);
          }
          
          if (positionData.type_id) {
            const typeData = await careerService.getTypeById(positionData.type_id);
            setType(typeData);
          }
          
          if (positionData.level_id) {
            const levelData = await careerService.getLevelById(positionData.level_id);
            setLevel(levelData);
          }
        }
      } catch (error) {
        console.error("Failed to load position data:", error);
        toast({
          title: "Error",
          description: "Failed to load position data",
          variant: "destructive",
        });
      }
    };
    loadData();
  }, [careerService, toast, positionId]);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="default" className="bg-success text-success-foreground">Open</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "closed":
        return <Badge variant="destructive">Closed</Badge>;
      case "filled":
        return <Badge variant="outline">Filled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSalary = (min: number, max: number, currency: string, type: string) => {
    if (!min && !max) return "Not specified";
    
    const minStr = min ? `${min.toLocaleString()}` : "0";
    const maxStr = max ? `${max.toLocaleString()}` : "0";
    
    return `${currency} ${minStr} - ${maxStr} (${type})`;
  };

  if (!position) {
    return (
      <DashboardFormTemplate
        breadcrumbs={[
          { label: "Career", href: "/dashboard/career" },
          { label: "Position Details", isCurrentPage: true },
        ]}
        title="Loading..."
        description="Loading position details..."
        backHref="/dashboard/career"
        backLabel="Back to Career"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading position details...</p>
          </div>
        </div>
      </DashboardFormTemplate>
    );
  }

  return (
    <DashboardFormTemplate
      breadcrumbs={[
        { label: "Career", href: "/dashboard/career" },
        { label: position.title, isCurrentPage: true },
      ]}
      title={position.title}
      description={position.summary || "Career position details"}
      backHref="/dashboard/career"
      backLabel="Back to Career"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-card rounded-lg border shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {getStatusBadge(position.status)}
            {position.featured && <Badge variant="outline" className="border-primary/20 text-primary">Featured</Badge>}
            {position.urgent && <Badge variant="destructive">Urgent</Badge>}
            {position.remote_allowed && <Badge variant="secondary" className="bg-secondary text-secondary-foreground">Remote</Badge>}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/career/${positionId}/edit`)}
              disabled={loading}
              className="hover:bg-primary/5 hover:border-primary/20"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Position
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Position
            </Button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Position Overview Card */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Position Overview
                </CardTitle>
                <CardDescription>
                  Basic information about this career position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {location?.name || "Not specified"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Type</p>
                      <p className="font-medium">
                        {type?.name || "Not specified"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Level</p>
                      <p className="font-medium">
                        {level?.name || "Not specified"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Salary</p>
                      <p className="font-medium">
                        {formatSalary(position.salary_min, position.salary_max, position.salary_currency, position.salary_type)}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Application Deadline</p>
                      <p className="font-medium">
                        {formatDate(position.application_deadline)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                      <p className="font-medium">
                        {formatDate(position.start_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description Card */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Job Description
                </CardTitle>
                <CardDescription>
                  Detailed description of the role and responsibilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {position.description && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Description</h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{position.description}</p>
                    </div>
                  </div>
                )}

                {position.requirements && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Requirements</h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{position.requirements}</p>
                    </div>
                  </div>
                )}

                {position.benefits && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Benefits & Perks</h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{position.benefits}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar Content */}
          <div className="space-y-6">
            {/* Stats Overview Card */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Performance
                </CardTitle>
                <CardDescription>
                  Position engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <p className="text-2xl font-bold text-primary">{position.views_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Views</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-success/5 to-success/10 rounded-lg border border-success/20">
                    <p className="text-2xl font-bold text-success">{position.applications_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Applications</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">{formatDate(position.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="font-medium">{formatDate(position.updated_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Information Card */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  SEO Information
                </CardTitle>
                <CardDescription>
                  SEO metadata for this position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">SEO Title</Label>
                    <p className="text-sm font-medium mt-1 p-2 bg-muted/30 rounded border">
                      {position.seo_title || "Not set"}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">SEO Description</Label>
                    <p className="text-sm font-medium mt-1 p-2 bg-muted/30 rounded border">
                      {position.seo_description || "Not set"}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">SEO Keywords</Label>
                    <p className="text-sm font-medium mt-1 p-2 bg-muted/30 rounded border">
                      {position.seo_keywords || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Public URL Card */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-primary" />
                  Public URL
                </CardTitle>
                <CardDescription>
                  Link to the public career position page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Input
                    value={`${window.location.origin}/career/${position.slug}`}
                    readOnly
                    className="font-mono text-sm bg-muted/30 border-border/50"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/career/${position.slug}`);
                        toast({
                          title: "URL Copied!",
                          description: "Public URL copied to clipboard",
                          variant: "success",
                        });
                      }}
                      className="flex-1 hover:bg-primary/5 hover:border-primary/20"
                    >
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/career/${position.slug}`, '_blank')}
                      className="flex-1 hover:bg-primary/5 hover:border-primary/20"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardFormTemplate>
  );
}
