"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Edit, Trash2, Eye, Calendar, MapPin, Briefcase, Users, DollarSign } from "lucide-react";

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
          
          // Load related data
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
        return <Badge variant="default">Open</Badge>;
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
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getStatusBadge(position.status)}
            {position.featured && <Badge variant="outline">Featured</Badge>}
            {position.urgent && <Badge variant="destructive">Urgent</Badge>}
            {position.remote_allowed && <Badge variant="secondary">Remote</Badge>}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/career/${positionId}/edit`)}
              disabled={loading}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Position
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Position
            </Button>
          </div>
        </div>

        {/* Position Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Position Overview</CardTitle>
            <CardDescription>
              Basic information about this career position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {location?.name || "Not specified"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground">
                    {type?.name || "Not specified"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Level</p>
                  <p className="text-sm text-muted-foreground">
                    {level?.name || "Not specified"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Salary</p>
                  <p className="text-sm text-muted-foreground">
                    {formatSalary(position.salary_min, position.salary_max, position.salary_currency, position.salary_type)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Application Deadline</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(position.application_deadline)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(position.start_date)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{position.views_count || 0}</p>
                <p className="text-sm text-muted-foreground">Views</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{position.applications_count || 0}</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Created: {formatDate(position.created_at)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Updated: {formatDate(position.updated_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>
              Detailed description of the role and responsibilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {position.description && (
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{position.description}</p>
                </div>
              </div>
            )}

            {position.requirements && (
              <div>
                <h4 className="font-medium mb-2">Requirements</h4>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{position.requirements}</p>
                </div>
              </div>
            )}

            {position.benefits && (
              <div>
                <h4 className="font-medium mb-2">Benefits & Perks</h4>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{position.benefits}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SEO Information */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Information</CardTitle>
            <CardDescription>
              SEO metadata for this position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">SEO Title</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {position.seo_title || "Not set"}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">SEO Description</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {position.seo_description || "Not set"}
                </p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">SEO Keywords</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {position.seo_keywords || "Not set"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Public URL */}
        <Card>
          <CardHeader>
            <CardTitle>Public URL</CardTitle>
            <CardDescription>
              Link to the public career position page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input
                value={`${window.location.origin}/career/${position.slug}`}
                readOnly
                className="font-mono text-sm"
              />
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
              >
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/career/${position.slug}`, '_blank')}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardFormTemplate>
  );
}
