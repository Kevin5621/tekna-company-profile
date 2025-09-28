"use client";

import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-t relative z-30 pointer-events-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-sidebar-foreground mb-4">
                Tekna
              </h3>
              <p className="text-sidebar-foreground/80 text-sm leading-relaxed">
                We are a trusted technology partner that helps businesses grow through innovative and high-quality digital solutions.
              </p>
            </div>
          </div>

          {/* Section 1: Services (Non-clickable, hover only) */}
          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-6">
              Our Services
            </h4>
            <ul className="space-y-3">
              <li className="text-sidebar-foreground/80 text-sm flex items-center group cursor-default">
                Web Development
              </li>
              <li className="text-sidebar-foreground/80 text-sm flex items-center group cursor-default">
                Mobile Apps
              </li>
              <li className="text-sidebar-foreground/80 text-sm flex items-center group cursor-default">
                IoT Solutions
              </li>
              <li className="text-sidebar-foreground/80 text-sm flex items-center group cursor-default">
                UI/UX Design
              </li>
              <li className="text-sidebar-foreground/80 text-sm flex items-center group cursor-default">
                Cloud Services
              </li>
              <li className="text-sidebar-foreground/80 text-sm flex items-center group cursor-default">
                Digital Marketing
              </li>
            </ul>
          </div>

          {/* Section 2: Company */}
          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sidebar-foreground/80 hover:text-sidebar-accent transition-colors text-sm flex items-center group"
                >
                  About Us
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-sidebar-foreground/80 hover:text-sidebar-accent transition-colors text-sm flex items-center group"
                >
                  Our Team
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/career"
                  className="text-sidebar-foreground/80 hover:text-sidebar-accent transition-colors text-sm flex items-center group"
                >
                  Career
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sidebar-foreground/80 hover:text-sidebar-accent transition-colors text-sm flex items-center group"
                >
                  Blog
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sidebar-foreground/80 hover:text-sidebar-accent transition-colors text-sm flex items-center group"
                >
                  Portfolio
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Support */}
          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-6">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sidebar-foreground/80 hover:text-sidebar-accent transition-colors text-sm flex items-center group"
                >
                  FAQ
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-sidebar-border" />

        {/* Contact Information */}
        <div className="mb-12">
          <h4 className="font-semibold text-sidebar-foreground mb-6 text-center">
            Contact Us
          </h4>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-sidebar-accent/20 rounded-full mb-3">
                <Mail className="w-5 h-5 text-sidebar-accent" />
              </div>
              <p className="text-sm text-sidebar-foreground/80 mb-1">
                Email
              </p>
              <a
                href="mailto:info@tekna.com"
                className="text-sm font-medium text-sidebar-foreground hover:text-sidebar-accent transition-colors"
              >
                info@tekna.com
              </a>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-sidebar-accent/20 rounded-full mb-3">
                <Phone className="w-5 h-5 text-sidebar-accent" />
              </div>
              <p className="text-sm text-sidebar-foreground/80 mb-1">
                Phone
              </p>
              <a
                href="tel:+1234567890"
                className="text-sm font-medium text-sidebar-foreground hover:text-sidebar-accent transition-colors"
              >
                +1 (234) 567-890
              </a>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-sidebar-accent/20 rounded-full mb-3">
                <MapPin className="w-5 h-5 text-sidebar-accent" />
              </div>
              <p className="text-sm text-sidebar-foreground/80 mb-1">
                Address
              </p>
              <p className="text-sm font-medium text-sidebar-foreground">
                123 Tech Street, Digital City
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-sidebar-accent/20 rounded-full mb-3">
                <Globe className="w-5 h-5 text-sidebar-accent" />
              </div>
              <p className="text-sm text-sidebar-foreground/80 mb-1">
                Website
              </p>
              <a
                href="https://tekna.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-sidebar-foreground hover:text-sidebar-accent transition-colors"
              >
                tekna.com
              </a>
            </div>
          </div>
        </div>

        <Separator className="mb-8 bg-sidebar-border" />

        {/* Social Media & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-sidebar-foreground/80">
              Follow Us:
            </span>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/tekna"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sidebar-foreground/80 hover:text-sidebar-accent transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/tekna"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sidebar-foreground/80 hover:text-sidebar-accent transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/tekna"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sidebar-foreground/80 hover:text-sidebar-accent transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.815 3.708 13.664 3.708 12.367s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/tekna"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sidebar-foreground/80 hover:text-sidebar-accent transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-sidebar-foreground/80">
            <p>
              &copy; {new Date().getFullYear()} Tekna. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="hover:text-sidebar-accent transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-sidebar-accent transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
