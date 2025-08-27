import { DashboardService } from "@/lib/services/dashboard.service";
import { AuthorsPageClient } from "./authors-client";

export default async function AuthorsPage() {
  const authors = await DashboardService.getTeamMembers();

  return <AuthorsPageClient initialAuthors={authors} />;
}
