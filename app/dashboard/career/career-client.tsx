"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardPageTemplate } from "@/components/dashboard/dashboard-page-template";
import { Users, Briefcase, MapPin, TrendingUp, Clock, Star, Search, Filter, X, FileText, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { CareerPosition } from "@/lib/services/career";

interface CareerClientProps {
  readonly initialPositions: CareerPosition[];
}

export default function CareerClient({ initialPositions }: CareerClientProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");



  const stats = useMemo(() => {
    const pos: CareerPosition[] = initialPositions || [];
    
    const openPos = pos.filter((p) => p.status === "open");
    const closedPos = pos.filter((p) => p.status === "closed");
    const draftPos = pos.filter((p) => p.status === "draft");
    const filledPos = pos.filter((p) => p.status === "filled");
    
    return {
      totalPositions: pos.length,
      openPositions: openPos.length,
      closedPositions: closedPos.length,
      draftPositions: draftPos.length,
      filledPositions: filledPos.length,
      totalApplications: pos.reduce((sum: number, p: CareerPosition) => sum + (p.applications_count || 0), 0),
      featuredPositions: pos.filter((p) => p.featured).length,
    };
  }, [initialPositions]);

  const filteredPositions = useMemo(() => {
    let filtered = initialPositions;

    // Active tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((p) => p.status === activeTab);
    }

    // Status filter (additional)
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.summary?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [initialPositions, activeTab, statusFilter, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-100 text-green-800";
      case "closed": return "bg-red-100 text-red-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "filled": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="h-4 w-4" />;
      case "closed": return <X className="h-4 w-4" />;
      case "draft": return <FileText className="h-4 w-4" />;
      case "filled": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <DashboardPageTemplate
      breadcrumbs={[{ label: "Career", href: "/dashboard/career" }, { label: "Career Management", isCurrentPage: true }]}
      title="Career Management"
      description="Manage job positions, categories, and applications"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPositions}</div>
            <p className="text-xs text-muted-foreground">All positions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openPositions}</div>
            <p className="text-xs text-muted-foreground">Accepting applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.closedPositions}</div>
            <p className="text-xs text-muted-foreground">No longer accepting</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftPositions}</div>
            <p className="text-xs text-muted-foreground">Work in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filled</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.filledPositions}</div>
            <p className="text-xs text-muted-foreground">Position filled</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <div className="mt-6 space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("all")}
            className="text-xs"
          >
            All ({stats.totalPositions})
          </Button>
          <Button
            variant={activeTab === "open" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("open")}
            className="text-xs"
          >
            <Clock className="h-3 w-3 mr-1" />
            Open ({stats.openPositions})
          </Button>
          <Button
            variant={activeTab === "closed" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("closed")}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Closed ({stats.closedPositions})
          </Button>
          <Button
            variant={activeTab === "draft" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("draft")}
            className="text-xs"
          >
            <FileText className="h-3 w-3 mr-1" />
            Draft ({stats.draftPositions})
          </Button>
          <Button
            variant={activeTab === "filled" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("filled")}
            className="text-xs"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Filled ({stats.filledPositions})
          </Button>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
        <Link href="/dashboard/career/applications" prefetch={false}>
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="text-sm font-medium">Applications</div>
              <div className="text-xs text-muted-foreground">{stats.totalApplications}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/career/categories" prefetch={false}>
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
            <CardContent className="p-4 text-center">
              <Briefcase className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="text-sm font-medium">Categories</div>
              <div className="text-xs text-muted-foreground">Manage</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/career/locations" prefetch={false}>
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
            <CardContent className="p-4 text-center">
              <MapPin className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="text-sm font-medium">Locations</div>
              <div className="text-xs text-muted-foreground">Manage</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/career/types" prefetch={false}>
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
            <CardContent className="p-4 text-center">
              <Briefcase className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="text-sm font-medium">Types</div>
              <div className="text-xs text-muted-foreground">Manage</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/career/levels" prefetch={false}>
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="text-sm font-medium">Levels</div>
              <div className="text-xs text-muted-foreground">Manage</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Active Positions Overview - Compact Cards */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Career Positions</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {filteredPositions.length} of {initialPositions.length} positions
            </span>
            <Button asChild size="sm">
              <Link href="/dashboard/career/new" prefetch={false}>
                Add New Position
              </Link>
            </Button>
          </div>
        </div>
        


        {filteredPositions.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredPositions.map((position: CareerPosition) => (
              <Card key={position.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header with title and status */}
                    <div className="flex items-start justify-between">
                      <Link href={`/dashboard/career/${position.id}`} prefetch={false}>
                        <h3 className="text-base font-semibold hover:text-primary transition-colors cursor-pointer line-clamp-2">
                          {position.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1">
                        {position.featured && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge 
                          className={`text-xs ${getStatusColor(position.status)}`}
                        >
                          {getStatusIcon(position.status)}
                          {position.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Position details */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{position.location?.name || 'Remote'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3 w-3" />
                        <span>{position.type?.name || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3" />
                        <span>{position.level?.name || '-'}</span>
                      </div>
                    </div>

                    {/* Applications count and actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{position.applications_count || 0}</span>
                        <span className="text-xs text-muted-foreground">applications</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/career/${position.id}`} prefetch={false}>
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/career/${position.id}/edit`} prefetch={false}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">No positions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by creating your first job position to manage your career opportunities.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/career/new" prefetch={false}>
                      Create First Position
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardPageTemplate>
  );
}
