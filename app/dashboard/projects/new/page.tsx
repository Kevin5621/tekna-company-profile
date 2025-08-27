import { ProjectForm } from "@/components/project-form";
import { DashboardFormTemplate } from "@/components/dashboard/dashboard-form-template";

export default function NewProjectPage() {
  return (
    <DashboardFormTemplate
      breadcrumbs={[
        { label: "Proyek", href: "/dashboard/projects" },
        { label: "Tambah Proyek Baru", isCurrentPage: true },
      ]}
      title="Tambah Proyek Baru"
      description="Buat proyek baru untuk ditampilkan di website"
      backHref="/dashboard/projects"
      backLabel="Kembali ke Projects"
    >
      <div className="dashboard-form-container">
        <ProjectForm mode="create" />
      </div>
    </DashboardFormTemplate>
  );
}
