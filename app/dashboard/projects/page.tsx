import { DashboardService } from "@/lib/services/dashboard.service";
import ProjectsPageClient from "./projects-client";

async function getProjects() {
  try {
    return await DashboardService.getProjects();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsPageClient initialProjects={projects} />;
}
