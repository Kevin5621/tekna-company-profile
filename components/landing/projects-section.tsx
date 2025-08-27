import { PublicService } from "@/lib/services/public.service";
import { ProjectsSectionClient } from "./projects-section-client";

export async function ProjectsSection() {
  const projects = await PublicService.getFeaturedProjects("id"); // Indonesian by default

  return <ProjectsSectionClient projects={projects} />;
}
