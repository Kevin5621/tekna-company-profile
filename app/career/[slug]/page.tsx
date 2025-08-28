"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BackgroundPaths } from "@/components/ui/shadcn-io/background-paths";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Building2,
  Star,
  UserPlus,
  Share2,
  CheckCircle,
  Send,
  Calendar,
  Globe,
  Users,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import {
  CareerService,
  CareerPosition,
} from "@/lib/services/career";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ContentRenderer } from "@/components/content-renderer";

export default function CareerDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [position, setPosition] = useState<CareerPosition | null>(null);
  const [relatedPositions, setRelatedPositions] = useState<CareerPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applying, setApplying] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [applicationData, setApplicationData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    cover_letter: "",
    resume_url: "",
    portfolio_url: "",
    linkedin_url: "",
    github_url: "",
    source: "website",
  });

  const careerService = useMemo(() => new CareerService(), []);

  useEffect(() => {
    const loadPosition = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        // Use the correct method to get position by slug
        const foundPosition = await careerService.getPublicPositionBySlug(slug as string);
        
        if (foundPosition) {
          setPosition(foundPosition);
          
          // Load related positions if category exists
          if (foundPosition.category_id) {
            try {
              const related = await careerService.getRelatedPositions(
                foundPosition.id,
                foundPosition.category_id,
                3
              );
              setRelatedPositions(related);
            } catch (error) {
              console.warn("Failed to load related positions:", error);
              // Don't fail the whole page for related positions
            }
          }
        } else {
          // Position not found - trigger Next.js not-found page
          console.warn("Position not found for slug:", slug);
          notFound();
        }
      } catch (error) {
        console.error("Error loading position:", error);
        toast({
          title: "❌ Loading Failed",
          description: "Failed to load position details. Please try again.",
        });
        // Don't redirect on error, let the user see the error
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    };

    loadPosition();
  }, [slug, careerService, toast]);

  const formatSalary = (min?: number, max?: number, currency = "IDR") => {
    if (!min && !max) return "Salary not disclosed";
    const format = (amount: number) => {
      if (currency === "IDR") return `Rp ${(amount / 1000000).toFixed(0)}M`;
      return `$${(amount / 1000).toFixed(0)}K`;
    };
    if (min && max) return `${format(min)} - ${format(max)}`;
    return min ? `From ${format(min)}` : `Up to ${format(max!)}`;
  };

  const handleApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) return;

    setApplying(true);
    try {
      const application = {
        position_id: position.id,
        ...applicationData,
      };

      const result = await careerService.submitApplication(application);

      if (result.success) {
        setShowApplicationForm(false);
        setApplicationData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          cover_letter: "",
          resume_url: "",
          portfolio_url: "",
          linkedin_url: "",
          github_url: "",
          source: "website",
        });

        toast({
          title: "🎉 Application Submitted Successfully!",
          description: "Thank you for your interest! You will receive a confirmation email shortly.",
        });
      } else {
        console.error("Application submission failed:", result.error);
        throw new Error(result.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      let errorMessage = "Failed to submit application. Please try again.";
      if (error instanceof Error && error.message) {
        errorMessage = `Failed to submit application: ${error.message}`;
      }

      toast({
        title: "❌ Submission Failed",
        description: errorMessage,
      });
    } finally {
      setApplying(false);
    }
  };

  const sharePosition = async () => {
    if (!position) return;

    const shareData = {
      title: `${position.title} - Career Opportunity`,
      text: position.description 
        ? `${position.description.substring(0, 150)}...`
        : `Check out this ${position.title} position at our company!`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setShareSuccess(true);
        toast({
          title: "📤 Shared Successfully!",
          description: "Position shared with your contacts.",
        });
        setTimeout(() => setShareSuccess(false), 3000);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        toast({
          title: "📋 URL Copied!",
          description: "Position URL copied to clipboard. You can now share it manually.",
        });
        setTimeout(() => setShareSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error sharing position:", error);
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        toast({
          title: "📋 URL Copied!",
          description: "Position URL copied to clipboard. You can now share it manually.",
        });
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (clipboardError) {
        console.error("Clipboard copy failed:", clipboardError);
        setShareSuccess(false);
        toast({
          title: "❌ Sharing Failed",
          description: "Unable to share or copy URL. Please try again.",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading position details...</p>
        </div>
      </div>
    );
  }

  if (!position) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/career")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground truncate flex-1 mx-4">
            {position.title}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={sharePosition}
            className="p-2"
          >
            {shareSuccess ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Hero Section - Mobile Optimized */}
      <section className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden">
        <BackgroundPaths />
        <div className="relative z-10 container mx-auto px-4 py-8 md:px-6 lg:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Back Button - Desktop Only */}
            <div className="hidden lg:block mb-6">
              <Button
                variant="ghost"
                onClick={() => router.push("/career")}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Careers
              </Button>
            </div>

            <div className="text-center lg:text-left">
              <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start mb-4">
                {position.featured && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  >
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
                {position.urgent && (
                  <Badge variant="destructive">
                    <Clock className="w-3 h-3 mr-1" />
                    Urgent
                  </Badge>
                )}
                <Badge
                  variant={
                    position.status === "open"
                      ? "default"
                      : position.status === "closed"
                      ? "secondary"
                      : "outline"
                  }
                  className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                >
                  {position.status}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent mb-4">
                {position.title}
              </h1>

              <div className="text-xl sm:text-2xl font-semibold text-primary-foreground/90 mb-6">
                {formatSalary(
                  position.salary_min,
                  position.salary_max,
                  position.salary_currency
                )}
              </div>

              {/* Action Buttons - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button
                  onClick={() => setShowApplicationForm(true)}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-8 text-lg font-semibold"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Apply Now
                </Button>
                <Button
                  onClick={sharePosition}
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 h-12 px-8 text-lg"
                >
                  {shareSuccess ? (
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  ) : (
                    <Share2 className="w-5 h-5 mr-2" />
                  )}
                  {shareSuccess ? "Shared!" : "Share"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12 bg-gradient-to-b from-background to-muted/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Position Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 bg-card rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-foreground font-semibold">{position.category?.name || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-foreground font-semibold">{position.location?.name || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Employment Type</p>
                <p className="text-foreground font-semibold">{position.type?.name || "Not specified"}</p>
              </div>
            </div>
            {position.level && (
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Experience Level</p>
                  <p className="text-foreground font-semibold">{position.level.name}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Posted</p>
                <p className="text-foreground font-semibold">
                  {new Date(position.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Remote</p>
                <p className="text-foreground font-semibold">
                  {position.remote_allowed ? "Allowed" : "Not allowed"}
                </p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <ContentRenderer 
                  content={position.description || "No description available."} 
                  contentType="markdown"
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {position.requirements && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <ContentRenderer 
                    content={position.requirements} 
                    contentType="markdown"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {position.benefits && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Benefits & Perks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <ContentRenderer 
                    content={position.benefits} 
                    contentType="markdown"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {position.skills && position.skills.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Required Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {position.skills.map((skillItem) => (
                    <Badge
                      key={skillItem.id}
                      variant={skillItem.level === "required" ? "default" : "secondary"}
                      className={cn(
                        "text-sm px-3 py-1.5",
                        skillItem.level === "required"
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-muted/50 text-muted-foreground border border-border"
                      )}
                    >
                      {skillItem.skill?.name}
                      {skillItem.level === "required" && " *"}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Apply Button - Bottom */}
          <div className="text-center py-8">
            <Button
              onClick={() => setShowApplicationForm(true)}
              className="bg-primary hover:bg-primary/90 h-14 px-12 text-lg font-semibold"
            >
              <UserPlus className="w-6 h-6 mr-3" />
              Apply for This Position
            </Button>
          </div>

          {/* Related Positions */}
          {relatedPositions.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                Similar Positions You Might Like
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedPositions.map((relatedPosition) => (
                  <Card
                    key={relatedPosition.id}
                    className="group cursor-pointer transition-all duration-200 border hover:border-primary/30 hover:shadow-md"
                    onClick={() => router.push(`/career/${relatedPosition.slug}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                            {relatedPosition.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <MapPin className="w-3 h-3" />
                            <span>{relatedPosition.location?.name}</span>
                          </div>
                          {relatedPosition.salary_min || relatedPosition.salary_max ? (
                            <p className="text-xs font-medium text-primary mb-2">
                              {formatSalary(relatedPosition.salary_min, relatedPosition.salary_max, relatedPosition.salary_currency)}
                            </p>
                          ) : null}
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs px-2 py-1">
                              {relatedPosition.level?.name}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-primary hover:text-primary/80 hover:bg-primary/10"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Apply for {position.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowApplicationForm(false);
                    toast({
                      title: "❌ Application Cancelled",
                      description: "Application form closed. You can apply again anytime.",
                    });
                  }}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApplication} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">
                      First Name *
                    </label>
                    <Input
                      value={applicationData.first_name}
                      onChange={(e) =>
                        setApplicationData((prev) => ({
                          ...prev,
                          first_name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">
                      Last Name *
                    </label>
                    <Input
                      value={applicationData.last_name}
                      onChange={(e) =>
                        setApplicationData((prev) => ({
                          ...prev,
                          last_name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={applicationData.email}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={applicationData.phone}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    Cover Letter
                  </label>
                  <Textarea
                    value={applicationData.cover_letter}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        cover_letter: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Tell us why you're perfect for this role..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    Resume URL
                  </label>
                  <Input
                    type="url"
                    value={applicationData.resume_url}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        resume_url: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">
                      Portfolio URL
                    </label>
                    <Input
                      type="url"
                      value={applicationData.portfolio_url}
                      onChange={(e) =>
                        setApplicationData((prev) => ({
                          ...prev,
                          portfolio_url: e.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">
                      LinkedIn URL
                    </label>
                    <Input
                      type="url"
                      value={applicationData.linkedin_url}
                      onChange={(e) =>
                        setApplicationData((prev) => ({
                          ...prev,
                          linkedin_url: e.target.value,
                        }))
                      }
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    GitHub URL
                  </label>
                  <Input
                    type="url"
                    value={applicationData.github_url}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        github_url: e.target.value,
                      }))
                    }
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowApplicationForm(false);
                      toast({
                        title: "❌ Application Cancelled",
                        description: "Application form closed. You can apply again anytime.",
                      });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={applying}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {applying ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
