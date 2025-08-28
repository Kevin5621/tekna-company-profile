import { HeroSection } from "@/components/landing/hero-section";
import { ProjectsSection } from "@/components/landing/projects-section";
import { PartnersSection } from "@/components/landing/partners-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { Footer } from "@/components/layout/footer";
import { AppHeader } from "@/components/layout/public-header";
import { GlobeBackground } from "@/components/ui/globe-background";
import { MainContent } from "@/components/landing/main-content";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header overlay for landing page */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <AppHeader />
      </div>

      {/* Globe Background - Fixed dan terlihat di semua section */}
      <GlobeBackground />

      {/* Main content with sticky hero and overlapping sections */}
      <MainContent>
        <div id="home">
          <HeroSection />
        </div>
        <div id="projects">
          <ProjectsSection />
        </div>
        <div id="partners">
          <PartnersSection />
        </div>
        <div id="testimonials">
          <TestimonialsSection />
        </div>
      </MainContent>

      <Footer />
    </div>
  );
}

