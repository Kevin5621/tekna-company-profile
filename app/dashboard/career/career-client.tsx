"use client";

import { useMemo } from "react";
import useSWR from "swr";
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
import { Users, Briefcase, MapPin, TrendingUp, Clock, Star } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

import type { CareerPosition } from "@/lib/services/career";

interface CareerClientProps {
  readonly initialPositions: CareerPosition[];
}

export default function CareerClient({ initialPositions }: CareerClientProps) {
  const { data: positionsPayload } = useSWR("/api/career/positions", fetcher, {
    fallbackData: { success: true, data: initialPositions },
    revalidateOnFocus: true,
  });

  const stats = useMemo(() => {
    const pos: CareerPosition[] = positionsPayload?.data || initialPositions || [];
    return {
      totalPositions: pos.length,
      openPositions: pos.filter((p) => p.status === "open").length,
      totalApplications: pos.reduce((sum: number, p: CareerPosition) => sum + (p.applications_count || 0), 0),
      featuredPositions: pos.filter((p) => p.featured).length,
    };
  }, [positionsPayload?.data, initialPositions]);

  const actions = (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link href="/dashboard/career/categories" prefetch={false}>
          Categories
        </Link>
      </Button>
      <Button asChild>
        <Link href="/dashboard/career/new" prefetch={false}>
          Add Position
        </Link>
      </Button>
    </div>
  );

  return (
    <DashboardPageTemplate
      breadcrumbs={[{ label: "Career", href: "/dashboard/career" }, { label: "Career Management", isCurrentPage: true }]}
      title="Career Management"
      description="Manage job positions, categories, and applications"
      actions={actions}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPositions}</div>
            <p className="text-xs text-muted-foreground">All job positions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openPositions}</div>
            <p className="text-xs text-muted-foreground">Currently accepting applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">All applications received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredPositions}</div>
            <p className="text-xs text-muted-foreground">Featured positions</p>
          </CardContent>
        </Card>
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
          <h2 className="text-xl font-semibold">Active Positions</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {((positionsPayload?.data as CareerPosition[]) || initialPositions || []).length} total positions
            </span>
            <Button asChild size="sm">
              <Link href="/dashboard/career/new" prefetch={false}>
                Add New Position
              </Link>
            </Button>
          </div>
        </div>

        {((positionsPayload?.data as CareerPosition[]) || initialPositions || []).length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {((positionsPayload?.data as CareerPosition[]) || initialPositions || []).map((position: CareerPosition) => (
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
                          variant={position.status === 'open' ? 'default' : position.status === 'closed' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
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
                          <Link href={`/dashboard/career/${position.id}/edit`} prefetch={false}>
                            Edit
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/career/${position.id}`} prefetch={false}>
                            View
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
