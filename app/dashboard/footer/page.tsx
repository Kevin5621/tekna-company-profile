"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Settings,
  Link as LinkIcon,
  Share2,
  Phone,
  ExternalLink,
  MapPin,
  Mail,
  Globe,
  Building,
  Clock,
  Users,
  FileText,
  HelpCircle,
  MessageCircle,
  BookOpen,
  Shield,
  Server,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  Github,
  Music,
} from "lucide-react";
import Link from "next/link";
import { DashboardPageTemplate } from "@/components/dashboard/dashboard-page-template";
import { FooterService, FooterSection, FooterLink, SocialMedia, ContactInfo } from "@/lib/services/footer";

export default function FooterManagementPage() {
  const [footerData, setFooterData] = useState({
    sections: [] as FooterSection[],
    links: [] as FooterLink[],
    socialMedia: [] as SocialMedia[],
    contactInfo: [] as ContactInfo[],
  });
  const [loading, setLoading] = useState(true);

  const footerService = useMemo(() => new FooterService(), []);

  const loadFooterData = useCallback(async () => {
    try {
      const [sections, socialMedia, contactInfo] = await Promise.all([
        footerService.getFooterSections(),
        footerService.getSocialMedia(),
        footerService.getContactInfo(),
      ]);

      // Get all links from all sections
      const allLinks = sections.flatMap((section: FooterSection) => section.links);

      setFooterData({
        sections,
        links: allLinks,
        socialMedia,
        contactInfo,
      });
    } catch (error) {
      console.error("Error loading footer data:", error);
    } finally {
      setLoading(false);
    }
  }, [footerService]);

  useEffect(() => {
    loadFooterData();
  }, [loadFooterData]);

  const stats = {
    totalSections: footerData.sections.length,
    totalLinks: footerData.links.length,
    socialPlatforms: footerData.socialMedia.length,
    contactMethods: footerData.contactInfo.length,
  };

  // Function to get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'map-pin': MapPin,
      'phone': Phone,
      'mail': Mail,
      'globe': Globe,
      'building': Building,
      'clock': Clock,
      'users': Users,
      'file-text': FileText,
      'help-circle': HelpCircle,
      'message-circle': MessageCircle,
      'book-open': BookOpen,
      'shield': Shield,
      'server': Server,
      'settings': Settings,
      'link': LinkIcon,
      'share': Share2,
    };
    
    return iconMap[iconName.toLowerCase()] || MapPin; // Default to MapPin if icon not found
  };

  // Function to get social media icon component
  const getSocialIconComponent = (platform: string) => {
    const socialIconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'facebook': Facebook,
      'twitter': Twitter,
      'instagram': Instagram,
      'linkedin': Linkedin,
      'youtube': Youtube,
      'tiktok': Share2, // Temporarily using Share2 as TikTok icon is not in lucide-react
      'whatsapp': Send,
      'telegram': Share2, // Temporarily using Share2 as Telegram icon is not in lucide-react
      'discord': Share2, // Temporarily using Share2 as Discord icon is not in lucide-react
      'github': Github,
      'reddit': Share2, // Temporarily using Share2 as Reddit icon is not in lucide-react
      'pinterest': Share2, // Temporarily using Share2 as Pinterest icon is not in lucide-react
      'snapchat': Share2, // Temporarily using Share2 as Snapchat icon is not in lucide-react
      'twitch': Share2, // Temporarily using Share2 as Twitch icon is not in lucide-react
      'spotify': Music, // Temporarily using Music as Spotify icon is not in lucide-react
    };
    
    return socialIconMap[platform.toLowerCase()] || Share2; // Default to Share2 if platform not found
  };

  const managementSections = [
    {
      title: "Footer Sections",
      description: "Manage footer sections and categories",
      icon: Settings,
      href: "/dashboard/footer/sections",
      count: stats.totalSections,
      color: "bg-blue-500",
    },
    {
      title: "Footer Links",
      description: "Manage links within footer sections",
      icon: LinkIcon,
      href: "/dashboard/footer/links",
      count: stats.totalLinks,
      color: "bg-green-500",
    },
    {
      title: "Social Media",
      description: "Manage social media links",
      icon: Share2,
      href: "/dashboard/footer/social-media",
      count: stats.socialPlatforms,
      color: "bg-purple-500",
    },
    {
      title: "Contact Information",
      description: "Manage contact details",
      icon: Phone,
      href: "/dashboard/footer/contact-info",
      count: stats.contactMethods,
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading footer data...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardPageTemplate
      breadcrumbs={[
        { label: "Footer", href: "/dashboard/footer" },
        { label: "Footer Management", isCurrentPage: true },
      ]}
      title="Footer Management"
      description="Manage all footer-related content and settings"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSections}</div>
            <p className="text-xs text-muted-foreground">
              Footer sections
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLinks}</div>
            <p className="text-xs text-muted-foreground">
              Footer links
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Media</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.socialPlatforms}</div>
            <p className="text-xs text-muted-foreground">
              Social platforms
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Info</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contactMethods}</div>
            <p className="text-xs text-muted-foreground">
              Contact methods
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-6">
        {managementSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.color}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {section.count} items
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  {section.description}
                </p>
                <Link href={section.href} prefetch={false}>
                  <Button className="w-full" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Manage {section.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Live Data Preview */}
      <div className="mt-8 space-y-6">
        {/* Social Media Preview */}
        {footerData.socialMedia.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Social Media Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {footerData.socialMedia.map((social) => {
                  const IconComponent = getSocialIconComponent(social.platform);
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer group"
                    >
                      <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {social.platform}
                      </span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Info Preview */}
        {footerData.contactInfo.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {footerData.contactInfo.map((contact) => {
                  const IconComponent = getIconComponent(contact.icon);
                  return (
                    <div key={contact.id} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground mb-1">
                          {contact.label}
                        </div>
                        <div className="text-sm text-muted-foreground break-words">
                          {contact.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Sections Preview */}
        {footerData.sections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Footer Sections Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {footerData.sections.map((section) => (
                  <div key={section.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-foreground">{section.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {section.links.length} links
                      </span>
                    </div>
                    {section.links.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {section.links.slice(0, 5).map((link) => (
                          <div key={link.id} className="flex items-center gap-1 text-xs text-muted-foreground">
                            <LinkIcon className="h-3 w-3" />
                            {link.title}
                            {link.is_external && <ExternalLink className="h-3 w-3" />}
                          </div>
                        ))}
                        {section.links.length > 5 && (
                          <span className="text-xs text-muted-foreground">
                            +{section.links.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardPageTemplate>
  );
}
