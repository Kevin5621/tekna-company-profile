import { ContentManagementService } from "@/lib/services/content-management.service";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, User, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PublicLayout } from "@/components/layout/public-layout";

export default async function AboutUsPage() {
  const contentService = new ContentManagementService();
  
  try {
    const aboutUsItems = await contentService.getPublicAboutUs();
    
    if (aboutUsItems.length === 0) {
      return (
        <PublicLayout>
          <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
            {/* Enhanced Header Section with better visual hierarchy */}
            <header className="text-center mb-16 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  About Us
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Learn more about Tekna and our mission to provide innovative technology solutions.
                </p>
              </div>
            </header>

            {/* Empty State */}
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Content Coming Soon
              </h2>
              <p className="text-foreground/80 mb-6">
                We&apos;re working on adding more information about our company. In the meantime, feel free to contact us directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="mailto:info@tekna.com"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </PublicLayout>
      );
    }

    // Sort by sort_order and get the first item as the main content
    const sortedItems = aboutUsItems.toSorted((a, b) => a.sort_order - b.sort_order);
    const mainContent = sortedItems[0];

    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
          {/* Enhanced Header Section with better visual hierarchy */}
          <header className="text-center mb-16 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {mainContent.title}
              </h1>
              {mainContent.featured_image_url && (
                <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden mx-auto max-w-4xl">
                  <Image
                    src={mainContent.featured_image_url}
                    alt={mainContent.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main role="main" aria-label="About us content">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div 
                  className="text-foreground/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: mainContent.content }}
                />
              </div>

              <Separator className="my-12" />

              {/* Additional About Us Content */}
              {aboutUsItems.length > 1 && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-foreground mb-8">More About Us</h2>
                  <div className="grid gap-8">
                    {aboutUsItems.slice(1).map((item) => (
                      <div key={item.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-2xl font-semibold text-foreground">{item.title}</h3>
                          <Badge variant="outline">
                            <FileText className="h-3 w-3 mr-1" />
                            Content
                          </Badge>
                        </div>
                        {item.featured_image_url && (
                          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                            <Image
                              src={item.featured_image_url}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div 
                          className="text-foreground/80 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Sort Order: {item.sort_order}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </PublicLayout>
    );
  } catch (error) {
    console.error("Error loading about us content:", error);
    return notFound();
  }
}

export async function generateMetadata() {
  const contentService = new ContentManagementService();
  
  try {
    const aboutUsItems = await contentService.getPublicAboutUs();
    
    if (aboutUsItems.length === 0) {
      return {
        title: "About Us - Tekna",
        description: "Learn more about Tekna and our mission to provide innovative technology solutions.",
      };
    }

    const sortedItems = aboutUsItems.toSorted((a, b) => a.sort_order - b.sort_order);
    const mainContent = sortedItems[0];

    return {
      title: mainContent.meta_title || `${mainContent.title} - Tekna`,
      description: mainContent.meta_description || "Learn more about Tekna and our mission to provide innovative technology solutions.",
      keywords: mainContent.meta_keywords || "about us, company, technology, innovation",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "About Us - Tekna",
      description: "Learn more about Tekna and our mission to provide innovative technology solutions.",
    };
  }
}
