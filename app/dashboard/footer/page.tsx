'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings, Link as LinkIcon, Share2, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { DashboardBreadcrumb } from '@/components/ui/dashboard-breadcrumb';
import BackButton from '@/components/ui/back-button';

export default function FooterManagementPage() {
  const managementSections = [
    {
      title: "Footer Sections",
      description: "Manage footer sections and categories",
      icon: Settings,
      href: "/dashboard/footer/sections",
      color: "bg-blue-500",
      count: "4 sections"
    },
    {
      title: "Footer Links",
      description: "Manage links within footer sections",
      icon: LinkIcon,
      href: "/dashboard/footer/links",
      color: "bg-green-500",
      count: "12 links"
    },
    {
      title: "Social Media",
      description: "Manage social media links",
      icon: Share2,
      href: "/dashboard/footer/social-media",
      color: "bg-purple-500",
      count: "5 platforms"
    },
    {
      title: "Contact Information",
      description: "Manage contact details",
      icon: Phone,
      href: "/dashboard/footer/contact-info",
      color: "bg-orange-500",
      count: "3 contacts"
    },
    {
      title: "Newsletter Settings",
      description: "Manage newsletter configuration",
      icon: Mail,
      href: "/dashboard/footer/newsletter",
      color: "bg-red-500",
      count: "1 setting"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb 
        items={[
          { label: "Footer", href: "/dashboard/footer" },
          { label: "Manajemen Footer", isCurrentPage: true }
        ]}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Footer Management</h1>
          <p className="text-muted-foreground">
            Manage all footer-related content and settings
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {managementSections.map((section) => {
          const IconComponent = section.icon
          return (
            <Card key={section.title} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {section.count}
                  </div>
                </div>
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={section.href}>
                  <Button className="w-full" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Manage {section.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Footer Overview</CardTitle>
          <CardDescription>
            Quick overview of footer content status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-muted-foreground">Active Sections</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-muted-foreground">Total Links</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-muted-foreground">Social Platforms</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-muted-foreground">Contact Methods</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
