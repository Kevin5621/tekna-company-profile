import { ContentManagementService } from "@/lib/services/content-management.service";
import { notFound } from "next/navigation";
import { Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PublicLayout } from "@/components/layout/public-layout";

export default async function FAQPage() {
  const contentService = new ContentManagementService();
  
  try {
    const faqItems = await contentService.getPublicFAQs();
    
    if (faqItems.length === 0) {
      return (
        <PublicLayout>
          <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
            {/* Enhanced Header Section with better visual hierarchy */}
            <header className="text-center mb-16 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Frequently Asked Questions
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Find answers to common questions about our services, products, and company.
                </p>
              </div>
            </header>

            {/* Empty State */}
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                No FAQs Available Yet
              </h2>
              <p className="text-foreground/80 mb-6">
                We&apos;re working on adding frequently asked questions. In the meantime, feel free to contact us directly.
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

    // Group FAQs by category
    const faqsByCategory = faqItems.reduce((acc, faq) => {
      const category = faq.category || "General";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(faq);
      return acc;
    }, {} as Record<string, typeof faqItems>);

    // Sort FAQs within each category by sort_order
    Object.keys(faqsByCategory).forEach(category => {
      faqsByCategory[category].sort((a, b) => a.sort_order - b.sort_order);
    });

    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
          {/* Enhanced Header Section with better visual hierarchy */}
          <header className="text-center mb-16 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Frequently Asked Questions
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Find answers to common questions about our services, products, and company.
              </p>
            </div>
          </header>

          {/* FAQ Content */}
          <main role="main" aria-label="FAQ content">
            <div className="max-w-4xl mx-auto">
              {Object.keys(faqsByCategory).length === 1 && Object.keys(faqsByCategory)[0] === "General" ? (
                // Single category - show as simple accordion
                <Accordion type="single" collapsible className="space-y-4">
                  {faqsByCategory["General"].map((faq, index) => (
                    <AccordionItem key={faq.id} value={`item-${index}`} className="border rounded-lg px-6">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-center gap-3">
                          <span className="text-primary font-semibold">
                            Q{index + 1}
                          </span>
                          <span className="font-medium">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="text-foreground/80 leading-relaxed">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                // Multiple categories - show grouped
                <div className="space-y-12">
                  {Object.entries(faqsByCategory).map(([category, faqs]) => (
                    <div key={category}>
                      <div className="flex items-center gap-3 mb-6">
                        <Badge variant="outline" className="text-sm">
                          <Hash className="h-3 w-3 mr-1" />
                          {category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {faqs.length} question{faqs.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                          <AccordionItem key={faq.id} value={`item-${category}-${index}`} className="border rounded-lg px-6">
                            <AccordionTrigger className="text-left hover:no-underline">
                              <div className="flex items-center gap-3">
                                <span className="text-primary font-semibold">
                                  Q{index + 1}
                                </span>
                                <span className="font-medium">{faq.question}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                              <div className="text-foreground/80 leading-relaxed">
                                {faq.answer}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="my-12" />

              {/* Contact Section */}
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Still have questions?
                </h2>
                <p className="text-foreground/80 mb-6">
                  Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help!
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
          </main>
        </div>
      </PublicLayout>
    );
  } catch (error) {
    console.error("Error loading FAQ content:", error);
    notFound();
  }
}

export async function generateMetadata() {
  return {
    title: "FAQ - Frequently Asked Questions - Tekna",
    description: "Find answers to common questions about our services, products, and company. Get help with your inquiries.",
    keywords: "FAQ, frequently asked questions, help, support, questions, answers",
  };
}
