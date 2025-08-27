"use client";

import { useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { /* Input,  */ } from "@/components/ui/input";
import { /* Select, SelectContent, SelectItem, SelectTrigger, SelectValue */ } from "@/components/ui/select";
import { DashboardPageTemplate } from "@/components/dashboard/dashboard-page-template";

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPositions}</div>
            <p className="text-xs text-muted-foreground">All job positions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openPositions}</div>
            <p className="text-xs text-muted-foreground">Currently accepting applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">All applications received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredPositions}</div>
            <p className="text-xs text-muted-foreground">Featured positions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-6">
        <Link href="/dashboard/career/applications" prefetch={false}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage job applications</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/career/categories" prefetch={false}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage job categories</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/career/locations" prefetch={false}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage work locations</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/career/types" prefetch={false}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Types</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage job types</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/career/levels" prefetch={false}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage career levels</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-md transition-shadow cursor-pointer opacity-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Analytics</CardTitle>
            <CardDescription>Coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Positions table */}
      <div className="mt-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {((positionsPayload?.data as CareerPosition[]) || initialPositions || []).length ? (
                ((positionsPayload?.data as CareerPosition[]) || initialPositions || []).map((p: CareerPosition) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link href={`/dashboard/career/${p.id}`} prefetch={false}>
                        {p.title}
                      </Link>
                    </TableCell>
                    <TableCell>{p.location?.name || "-"}</TableCell>
                    <TableCell>{p.type?.name || "-"}</TableCell>
                    <TableCell>{p.level?.name || "-"}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell>{p.applications_count || 0}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/career/${p.id}/edit`} prefetch={false}>
                        Edit
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No positions.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardPageTemplate>
  );
}
