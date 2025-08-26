import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  IconUsers, 
  IconFolder, 
  IconArticle, 
  IconMessageCircle
} from "@tabler/icons-react";
import { DashboardService } from "@/lib/services/dashboard.service";
import type { DashboardData } from "@/lib/types/dashboard";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import BackButton from "@/components/ui/back-button";

// Utility functions for status mapping
const getProjectStatusBadge = (status: string) => {
  switch (status) {
    case 'completed': return 'default';
    case 'in-progress': return 'secondary';
    case 'planning': return 'outline';
    case 'on-hold': return 'secondary';
    default: return 'outline';
  }
};

const getProjectStatusText = (status: string) => {
  switch (status) {
    case 'completed': return 'Selesai';
    case 'in-progress': return 'Berjalan';
    case 'planning': return 'Perencanaan';
    case 'on-hold': return 'Ditahan';
    default: return 'Perencanaan';
  }
};

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
        { ...data.stats[3], icon: IconMessageCircle }
      ]
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return fallback data if there's an error
    return {
      stats: [
        {
          title: "Total Tim",
          value: "0",
          description: "Anggota tim aktif",
          icon: IconUsers,
          change: "0",
          changeType: "default"
        },
        {
          title: "Proyek Aktif",
          value: "0",
          description: "Proyek sedang berjalan",
          icon: IconFolder,
          change: "0",
          changeType: "default"
        },
        {
          title: "Artikel Blog",
          value: "0",
          description: "Artikel diterbitkan",
          icon: IconArticle,
          change: "0",
          changeType: "default"
        },
        {
          title: "Testimonial",
          value: "0",
          description: "Ulasan klien",
          icon: IconMessageCircle,
          change: "0",
          changeType: "default"
        }
      ],
      recentProjects: [],
      recentPosts: [],
      servicesCount: 0
    };
  }
}

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb 
        items={[
          { label: "Beranda", isCurrentPage: true }
        ]}
      />

      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Selamat Datang di Dashboard</h1>
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
              {stat.icon && <stat.icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="flex items-center pt-2">
                <Badge variant={stat.changeType === "positive" ? "default" : "secondary"}>
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

      {/* Recent Projects & Posts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Proyek Terbaru</CardTitle>
            <CardDescription>
              Proyek yang sedang berjalan dan baru selesai
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.recentProjects.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{project.name}</p>
                      {project.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getProjectStatusBadge(project.status)}>
                        {getProjectStatusText(project.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <IconFolder className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Belum ada proyek</p>
              </div>
            )}
          </CardContent>
        </Card>

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
                      <p className="text-sm font-medium leading-none">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Oleh {post.author} • {post.views} views
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                        {post.status === 'published' ? 'Diterbitkan' : 'Draft'}
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
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>
            Akses cepat ke fitur-fitur utama
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <a href="/dashboard/projects" className="flex flex-col items-center space-y-2 p-4 rounded-lg border hover:bg-accent transition-colors">
              <IconFolder className="h-6 w-6" />
              <span className="text-sm font-medium">Kelola Proyek</span>
            </a>
            <a href="/dashboard/blog" className="flex flex-col items-center space-y-2 p-4 rounded-lg border hover:bg-accent transition-colors">
              <IconArticle className="h-6 w-6" />
              <span className="text-sm font-medium">Kelola Blog</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
