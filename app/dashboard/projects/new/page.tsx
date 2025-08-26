import { ProjectForm } from "@/components/project-form";
import { DashboardBreadcrumb } from '@/components/ui/dashboard-breadcrumb';
import BackButton from '@/components/ui/back-button';

export default function NewProjectPage() {
  return (
    <div className="space-y-6 min-h-full dashboard-form-page">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb 
        items={[
          { label: "Proyek", href: "/dashboard/projects" },
          { label: "Tambah Proyek Baru", isCurrentPage: true }
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/projects" label="Kembali ke Projects" />
      </div>

      <div className="dashboard-form-container">
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}
