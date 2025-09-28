"use client";

import Image from "next/image";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { motion } from "framer-motion";
import {
  Calendar,
  Tag,
  ImageIcon,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ContentRenderer } from "@/components/content-renderer";

interface ProjectImage {
  id: string;
  image_url: string;
  alt_text?: string;
  caption?: string;
  sort_order: number;
}

interface RelatedProject {
  id: string;
  name: string;
  slug: string;
  project_url?: string;
  featured_image_url?: string;
  description: string;
  short_description?: string;
  is_featured: boolean;
}

interface ProjectDetailData {
  id: string;
  name: string;
  slug: string;
  project_url?: string;
  description: string;
  short_description?: string;
  featured_image_url?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  images: ProjectImage[];
  // Additional project information
  technologies?: string;
  client_name?: string;
  project_date?: string;
  project_duration?: string;
  team_size?: string;
  project_status?: string;
}

interface ProjectDetailClientProps {
  project: ProjectDetailData;
  relatedProjects: RelatedProject[];
}

export function ProjectDetailClient({
  project,
  relatedProjects,
}: Readonly<ProjectDetailClientProps>) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  // Sort gallery images by sort_order
  const sortedImages = project.images.toSorted((a, b) => a.sort_order - b.sort_order);
  
  // Only use gallery images, don't include featured image
  const allImages = sortedImages;

  const hasGallery = allImages.length > 0;


  useEffect(() => {
    // Track page view (analytics)
    const trackView = async () => {
      try {
        await fetch(`/api/projects/${project.id}/views`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to track view:", error);
      }
    };

    trackView();
  }, [project.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.meta_title || project.name,
          text: project.meta_description || project.short_description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        setIsShareDialogOpen(true);
      }
    } else {
      setIsShareDialogOpen(true);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Image */}
        {project.featured_image_url && (
          <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh]">
            <Image
              src={project.featured_image_url}
              alt={project.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {project.is_featured && (
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
                <Badge variant="outline" className="text-white border-white/30 bg-black/20">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(project.created_at).toLocaleDateString()}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                {project.name}
              </h1>
              
              {project.short_description && (
                <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow max-w-2xl">
                  {project.short_description}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>

                <Button size="lg" variant="ghost" asChild>
                  <Link href="/projects">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Projects
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gallery" disabled={!hasGallery}>
                  Gallery ({allImages.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                    <CardDescription>
                      Detailed information about this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 py-6">
                    <ContentRenderer
                      content={project.description || ""}
                      contentType="markdown"
                      className="prose prose-foreground max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-p:text-sm prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-img:rounded-lg prose-img:shadow-md prose-pre:bg-slate-50 prose-pre:border prose-pre:rounded-md prose-pre:p-3 prose-pre:text-xs prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-md prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:text-sm prose-li:text-sm prose-li:leading-relaxed prose-table:text-sm prose-th:text-xs prose-td:text-xs"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="mt-8">
                {hasGallery && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        Project Gallery
                      </CardTitle>
                      <CardDescription>
                        Click on any image to view it in full size
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {allImages.map((image, index) => (
                          <Dialog key={image.id}>
                            <DialogTrigger asChild>
                              <div className="relative aspect-video cursor-pointer overflow-hidden rounded-lg hover:opacity-80 transition-opacity">
                                <Image
                                  src={image.image_url}
                                  alt={image.alt_text || `${project.name} - Image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 50vw, 33vw"
                                />
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl w-full">
                              <DialogHeader>
                                <DialogTitle>{image.alt_text || project.name}</DialogTitle>
                                {image.caption && (
                                  <DialogDescription>{image.caption}</DialogDescription>
                                )}
                              </DialogHeader>
                              <AspectRatio ratio={16 / 9}>
                                <Image
                                  src={image.image_url}
                                  alt={image.alt_text || project.name}
                                  fill
                                  className="object-contain"
                                  sizes="90vw"
                                />
                              </AspectRatio>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Status
                  </h4>
                  <Badge variant="outline">
                    {project.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {project.project_status && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">
                        Project Status
                      </h4>
                      <p className="text-sm capitalize">
                        {project.project_status}
                      </p>
                    </div>
                  </>
                )}

                {project.client_name && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">
                        Client
                      </h4>
                      <p className="text-sm">
                        {project.client_name}
                      </p>
                    </div>
                  </>
                )}

                {project.technologies && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">
                        Technologies
                      </h4>
                      <p className="text-sm">
                        {project.technologies}
                      </p>
                    </div>
                  </>
                )}

                {project.project_date && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">
                        Project Date
                      </h4>
                      <p className="text-sm">
                        {project.project_date}
                      </p>
                    </div>
                  </>
                )}

                {project.project_duration && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">
                        Duration
                      </h4>
                      <p className="text-sm">
                        {project.project_duration}
                      </p>
                    </div>
                  </>
                )}

                {project.team_size && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">
                        Team Size
                      </h4>
                      <p className="text-sm">
                        {project.team_size}
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Created
                  </h4>
                  <p className="text-sm">
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Last Updated
                  </h4>
                  <p className="text-sm">
                    {new Date(project.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-8">
              <Tag className="w-5 h-5" />
              <h2 className="text-2xl font-bold">Related Projects</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((relatedProject) => (
                <motion.div
                  key={relatedProject.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    {relatedProject.featured_image_url && (
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={relatedProject.featured_image_url}
                          alt={relatedProject.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </AspectRatio>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="line-clamp-1">
                          {relatedProject.name}
                        </CardTitle>
                        {relatedProject.is_featured && (
                          <Badge variant="secondary" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      {relatedProject.short_description && (
                        <CardDescription className="line-clamp-2">
                          {relatedProject.short_description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button asChild className="w-full">
                        <Link href={`/projects/${relatedProject.slug}`}>
                          View Project
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this project</DialogTitle>
            <DialogDescription>
              Copy the link below to share this project with others.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <input
              className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm"
              type="text"
              value={typeof window !== "undefined" ? window.location.href : ""}
              readOnly
            />
            <Button
              onClick={() =>
                copyToClipboard(
                  typeof window !== "undefined" ? window.location.href : ""
                )
              }
            >
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}