import { MetadataRoute } from "next";
import { PublicService } from "@/lib/services/public.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tekna.com";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/career`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  try {
    // Get all published blog posts
    const postsResult = await PublicService.getPaginatedPublishedPosts({
      page: 1,
      limit: 1000, // Get all posts
    });

    const blogPosts = postsResult.data.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    // Get all categories
    const categories = await PublicService.getActiveCategories();
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...blogPosts, ...categoryPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
