import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconUsers,
  IconFolder,
  IconArticle,
  IconMessageCircle,
  IconTrendingUp,
  IconEye,
  IconCalendar,
  IconBriefcase,
} from "@tabler/icons-react";
import { DashboardService } from "@/lib/services/dashboard.service";
import { CareerService } from "@/lib/services/career";
import type { DashboardData } from "@/lib/types/dashboard";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import { DashboardChart } from "@/components/dashboard-chart";

// Function to get total career applications
async function getTotalCareerApplications(): Promise<number> {
  try {
    const careerService = new CareerService();
    const applications = await careerService.getAllApplications();
    return applications.length;
  } catch (error) {
    console.error("Error fetching career applications:", error);
    return 0;
  }
}

// Function to get dashboard data using service
async function getDashboardData(): Promise<DashboardData> {
  try {
    const data = await DashboardService.getDashboardData();

    // Add icons to stats
    return {
      ...data,
      stats: [
        { ...data.stats[0], icon: IconUsers },
        { ...data.stats[1], icon: IconFolder },
        { ...data.stats[2], icon: IconArticle },
        { ...data.stats[3], icon: IconMessageCircle },
      ],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return fallback data if there's an error
    return {
      stats: [
        {
          title: "Total Tim",
          value: "0",
          description: "Anggota tim aktif",
          icon: IconUsers,
          change: "0",
          changeType: "default",
        },
        {
          title: "Proyek Aktif",
          value: "0",
          description: "Proyek sedang berjalan",
          icon: IconFolder,
          change: "0",
          changeType: "default",
        },
        {
          title: "Artikel Blog",
          value: "0",
          description: "Artikel diterbitkan",
          icon: IconArticle,
          change: "0",
          changeType: "default",
        },
        {
          title: "Testimonial",
          value: "0",
          description: "Ulasan klien",
          icon: IconMessageCircle,
          change: "0",
          changeType: "default",
        },
      ],
      recentProjects: [],
      recentPosts: [],
      servicesCount: 0,
    };
  }
}

export default async function DashboardPage() {
  const [dashboardData, totalApplications] = await Promise.all([
    getDashboardData(),
    getTotalCareerApplications(),
  ]);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb
        items={[{ label: "Beranda", isCurrentPage: true }]}
      />

      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Selamat Datang di Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Kelola website company profile Tekna Company dengan mudah dan efisien.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon && (
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="flex items-center pt-2">
                <Badge
                  variant={
                    stat.changeType === "positive" ? "default" : "secondary"
                  }
                >
                  {stat.change}
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">
                  dari bulan lalu
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Chart */}
      <DashboardChart totalApplications={totalApplications} />

      {/* Analytics Section - Career Applications */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Lamaran Karir
            </CardTitle>
            <IconBriefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              Total lamaran yang diterima
            </p>
            <div className="flex items-center pt-2">
              <Badge variant="default">Aktif</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Analytics Lainnya
            </CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              Coming Soon
            </div>
            <p className="text-xs text-muted-foreground">
              Fitur analitik mendalam
            </p>
            <div className="flex items-center pt-2">
              <Badge variant="secondary">Q1 2025</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insights</CardTitle>
            <IconEye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              Coming Soon
            </div>
            <p className="text-xs text-muted-foreground">
              Business intelligence
            </p>
            <div className="flex items-center pt-2">
              <Badge variant="secondary">Segera hadir</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Artikel Terbaru</CardTitle>
            <CardDescription>
              Artikel blog yang baru diterbitkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.recentPosts.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {post.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Oleh {post.author} • {post.views} views
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          post.status === "published" ? "default" : "outline"
                        }
                      >
                        {post.status === "published" ? "Diterbitkan" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <IconArticle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Belum ada artikel</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Akses cepat ke fitur-fitur utama</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="/dashboard/projects"
                className="flex flex-col items-center space-y-2 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <IconFolder className="h-6 w-6" />
                <span className="text-sm font-medium">Kelola Proyek</span>
              </a>
              <a
                href="/dashboard/blog"
                className="flex flex-col items-center space-y-2 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <IconArticle className="h-6 w-6" />
                <span className="text-sm font-medium">Kelola Blog</span>
              </a>
              <a
                href="/dashboard/career"
                className="flex flex-col items-center space-y-2 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <IconUsers className="h-6 w-6" />
                <span className="text-sm font-medium">Kelola Karir</span>
              </a>
              <a
                href="/dashboard/settings"
                className="flex flex-col items-center space-y-2 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <IconTrendingUp className="h-6 w-6" />
                <span className="text-sm font-medium">Pengaturan</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Layanan</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.servicesCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Layanan yang tersedia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <IconEye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.recentPosts
                .reduce((total, post) => total + post.views, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total views artikel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Update Terakhir
            </CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </div>
            <p className="text-xs text-muted-foreground">Hari ini</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
