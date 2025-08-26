import { ProjectForm } from "@/components/project-form";
import { DashboardBreadcrumb } from '@/components/ui/dashboard-breadcrumb';
import BackButton from '@/components/ui/back-button';

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
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

      <ProjectForm mode="create" />
    </div>
  );
}
