import { DashboardService } from "@/lib/services/dashboard.service";
import { BlogPageClient } from "./blog-client";

export default async function BlogPage() {
  const posts = await DashboardService.getBlogPosts();

  return <BlogPageClient initialPosts={posts} />;
}
