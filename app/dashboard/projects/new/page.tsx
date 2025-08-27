import { ProjectForm } from "@/components/project-form";
import { DashboardFormTemplate } from "@/components/dashboard/dashboard-form-template";

export default function NewProjectPage() {
  return (
    <DashboardFormTemplate
      breadcrumbs={[
        { label: "Projects", href: "/dashboard/projects" },
        { label: "Add New Project", isCurrentPage: true },
      ]}
      title="Add New Project"
      description="Create a new project to display on the website"
      backHref="/dashboard/projects"
      backLabel="Back to Projects"
    >
      <div className="dashboard-form-container">
        <ProjectForm mode="create" />
      </div>
    </DashboardFormTemplate>
  );
}
