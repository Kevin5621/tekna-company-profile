'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  ExternalLink,
  ArrowRight,
  Users,
  Briefcase,
  FileText,
  FolderOpen,
  MessageSquare,
  HelpCircle,
  Book,
  Activity,
  Shield,
  FileCheck,
  Smartphone,
  Cpu,
  Palette,
  Cloud,
  TrendingUp,
  Info
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  FooterService, 
  type FooterSection, 
  type SocialMedia, 
  type ContactInfo, 
  type CompanyInfo, 
  type NewsletterSettings 
} from "@/lib/services/footer";

// Icon mapping for dynamic icons
const iconMap = {
  Mail,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ExternalLink,
  Users,
  Briefcase,
  FileText,
  FolderOpen,
  MessageSquare,
  HelpCircle,
  Book,
  Activity,
  Shield,
  FileCheck,
  Smartphone,
  Cpu,
  Palette,
  Cloud,
  TrendingUp,
  Info
};

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [newsletterSettings, setNewsletterSettings] = useState<NewsletterSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const footerService = new FooterService();
    
    async function loadFooterData() {
      setIsLoading(true);
      try {
        const [sections, social, contact, company, newsletter] = await Promise.all([
          footerService.getPublicFooterSections(),
          footerService.getPublicSocialMedia(),
          footerService.getPublicContactInfo(),
          footerService.getCompanyInfo(),
          footerService.getPublicNewsletterSettings(),
        ]);

        setFooterSections(sections);
        setSocialMedia(social);
        setContactInfo(contact);
        setCompanyInfo(company);
        setNewsletterSettings(newsletter);
      } catch (error) {
        console.error('Error loading footer data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFooterData();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    try {
      const footerService = new FooterService();
      const success = await footerService.subscribeToNewsletter(email);
      
      if (success) {
        setIsSubscribed(true);
        setEmail('');
        
        // Reset message after 3 seconds
        setTimeout(() => setIsSubscribed(false), 3000);
      } else {
        // Handle error - you might want to show an error message
        console.error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent || ExternalLink;
  };

  if (isLoading) {
    return (
      <footer className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-t relative z-30 pointer-events-auto">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="animate-pulse">
            <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-cyan-200 dark:bg-cyan-800 rounded w-3/4"></div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-4 bg-cyan-150 dark:bg-cyan-750 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-t relative z-30 pointer-events-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
          {/* Company Info & Newsletter */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-sidebar-foreground mb-4">
                {companyInfo?.name || 'Tekna'}
              </h3>
              <p className="text-sidebar-foreground/80 text-sm leading-relaxed">
                {companyInfo?.short_description || 
                  'Kami adalah partner teknologi terpercaya yang membantu bisnis berkembang melalui solusi digital inovatif dan berkualitas tinggi.'}
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-3">
                {newsletterSettings?.title || 'Newsletter'}
              </h4>
              <p className="text-sm text-sidebar-foreground/80 mb-4">
                {newsletterSettings?.description || 
                  'Dapatkan update terbaru tentang teknologi dan tips bisnis.'}
              </p>
              
              {isSubscribed ? (
                <div className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-3">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {newsletterSettings?.success_message || 
                      '✓ Terima kasih! Anda telah berlangganan newsletter kami.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder={newsletterSettings?.placeholder_text || "Email Anda"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubscribing}
                      className="flex-1 bg-white dark:bg-cyan-950 border-cyan-300 dark:border-cyan-700 focus:border-cyan-500 dark:focus:border-cyan-400"
                    />
                    <Button 
                      type="submit" 
                      size="sm" 
                      disabled={isSubscribing}
                      className="px-3 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                    >
                      {isSubscribing ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Dynamic Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.id}>
              <h4 className="font-semibold text-sidebar-foreground mb-6">
                {section.name}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const IconComponent = getIcon(link.icon || 'ExternalLink');
                  return (
                    <li key={link.id}>
                      <Link 
                        href={link.url}
                        target={link.is_external ? '_blank' : undefined}
                        rel={link.is_external ? 'noopener noreferrer' : undefined}
                        className="text-sidebar-foreground/80 hover:text-sidebar-accent transition-colors text-sm flex items-center group"
                      >
                        {link.title}
                        <IconComponent className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-12 bg-sidebar-border" />

        {/* Contact Information */}
        {contactInfo.length > 0 && (
          <>
            <div className="mb-12">
              <h4 className="font-semibold text-sidebar-foreground mb-6 text-center">
                Hubungi Kami
              </h4>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {contactInfo.map((item) => {
                  const IconComponent = getIcon(item.icon);
                  return (
                    <div key={item.id} className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-sidebar-accent/20 rounded-full mb-3">
                        <IconComponent className="w-5 h-5 text-sidebar-accent" />
                      </div>
                      <p className="text-sm text-sidebar-foreground/80 mb-1">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a 
                          href={item.href}
                          className="text-sm font-medium text-sidebar-foreground hover:text-sidebar-accent transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-sidebar-foreground">
                          {item.value}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator className="mb-8 bg-sidebar-border" />
          </>
        )}

        {/* Social Media & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {socialMedia.length > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-sidebar-foreground/80">Ikuti Kami:</span>
              <div className="flex gap-3">
                {socialMedia.map((social) => {
                  const IconComponent = getIcon(social.icon);
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sidebar-foreground/80 hover:text-sidebar-accent transition-colors"
                      style={{ 
                        color: social.color ? undefined : undefined 
                      }}
                      onMouseEnter={(e) => {
                        if (social.color) {
                          (e.target as HTMLElement).style.color = social.color;
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = '';
                      }}
                      aria-label={social.platform}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-sidebar-foreground/80">
            <p>&copy; {new Date().getFullYear()} {companyInfo?.name || 'Tekna'}. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-sidebar-accent transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-sidebar-accent transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
