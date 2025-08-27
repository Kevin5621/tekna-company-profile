import { createClient } from "@/lib/supabase/server";

export class PublicService {
  /**
   * Get all published blog posts, ordered by newest first.
   */
  static async getPublishedBlogPosts() {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          title,
          slug,
          excerpt,
          featured_image_url,
          author_name,
          published_at,
          view_count,
          category_id,
          categories(
            id,
            name,
            slug,
            color
          )
        `
        )
        .eq("status", "published")
        .eq("is_active", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching published blog posts:", error);
      return [];
    }
  }

  /**
   * Get paginated published blog posts with search and category filtering
   */
  static async getPaginatedPublishedPosts(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      featured?: boolean;
    } = {}
  ) {
    const supabase = await createClient();
    const { page = 1, limit = 12, search, category, featured } = params;
    const offset = (page - 1) * limit;

    try {
      let query = supabase
        .from("posts")
        .select(
          `
          id,
          title,
          slug,
          excerpt,
          featured_image_url,
          author_name,
          published_at,
          created_at,
          view_count,
          category_id,
          is_featured,
          categories!category_id(
            id,
            name,
            slug,
            color
          )
        `,
          { count: "exact" }
        )
        .eq("status", "published")
        .eq("is_active", true);

      // Apply filters
      if (search && search.trim()) {
        query = query.or(
          `title.ilike.%${search.trim()}%,excerpt.ilike.%${search.trim()}%`
        );
      }

      if (category && category.trim()) {
        // Fix: Filter by category_id instead of categories.slug
        query = query.eq("category_id", category);
      }

      if (featured) {
        query = query.eq("is_featured", true);
      }

      // Apply pagination and ordering
      const { data, error, count } = await query
        .order("published_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("Error fetching paginated blog posts:", error);
      // Return empty data instead of throwing error
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  }

  /**
   * Get single published blog post by slug
   */
  static async getPublishedPostBySlug(slug: string) {
    const supabase = await createClient();
    try {
      // Get the main post data
      const { data: post, error: postError } = await supabase
        .from("posts")
        .select(
          `
          id,
          title,
          slug,
          excerpt,
          featured_image_url,
          published_at,
          created_at,
          view_count,
          category_id,
          is_featured,
          categories(
            id,
            name,
            slug,
            color,
            description
          ),
          author_name
        `
        )
        .eq("slug", slug)
        .eq("status", "published")
        .eq("is_active", true)
        .single();

      if (postError) {
        console.error("Error fetching post:", postError);
        throw postError;
      }

      if (!post) {
        console.log("No post found for slug:", slug);
        return null;
      }

      // Get the post content and meta data from translations
      const { data: translation, error: translationError } = await supabase
        .from("post_translations")
        .select(
          `
          content,
          meta_title,
          meta_description,
          meta_keywords
        `
        )
        .eq("post_id", post.id)
        .single();

      if (translationError) {
        console.warn("No translation found for post:", slug, translationError);
      }

      return {
        ...post,
        content: translation?.content || "",
        meta_title: translation?.meta_title || post.title,
        meta_description: translation?.meta_description || post.excerpt,
        meta_keywords: translation?.meta_keywords || "",
        category: post.categories ? post.categories[0] : null,
      };
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      return null;
    }
  }

  /**
   * Get related posts based on category or recent posts
   */
  static async getRelatedPosts(
    currentPostId: string,
    categoryId?: string,
    limit: number = 3
  ) {
    const supabase = await createClient();
    try {
      let query = supabase
        .from("posts")
        .select(
          `
          id,
          title,
          slug,
          excerpt,
          featured_image_url,
          published_at,
          created_at,
          categories(
            name,
            slug
          )
        `
        )
        .eq("status", "published")
        .eq("is_active", true)
        .neq("id", currentPostId)
        .limit(limit);

      // Prioritize posts from the same category
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query.order("published_at", {
        ascending: false,
      });

      if (error) throw error;

      // If we don't have enough related posts from the same category, get recent posts
      if (data && data.length < limit && categoryId) {
        const { data: additionalPosts, error: additionalError } = await supabase
          .from("posts")
          .select(
            `
            id,
            title,
            slug,
            excerpt,
            featured_image_url,
            published_at,
            created_at,
            categories(
              name,
              slug
            )
          `
          )
          .eq("status", "published")
          .eq("is_active", true)
          .neq("id", currentPostId)
          .neq("category_id", categoryId)
          .order("published_at", { ascending: false })
          .limit(limit - data.length);

        if (!additionalError && additionalPosts) {
          data.push(...additionalPosts);
        }
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching related posts:", error);
      return [];
    }
  }

  /**
   * Get all active categories
   */
  static async getActiveCategories() {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from("categories")
        .select(
          `
          id,
          name,
          slug,
          description,
          color,
          sort_order
        `
        )
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  /**
   * Search published blog posts
   */
  static async searchPosts(query: string, limit: number = 10) {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          title,
          slug,
          excerpt,
          featured_image_url,
          published_at,
          categories(
            name,
            slug
          ),
          author_name
        `
        )
        .eq("status", "published")
        .eq("is_active", true)
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching posts:", error);
      return [];
    }
  }

  /**
   * Increment view count for a blog post
   */
  static async incrementViewCount(postId: string) {
    const supabase = await createClient();
    try {
      const { error } = await supabase.rpc("increment_post_views", {
        post_id: postId,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error incrementing view count:", error);
      // Don't throw error as this is not critical
    }
  }

  /**
   * Get featured testimonials.
   */
  static async getFeaturedTestimonials() {
    // Return hardcoded testimonials since testimonials table doesn't exist
    return [
      {
        id: "1",
        client_name: "Sarah Johnson",
        client_position: "CEO",
        client_company: "TechCorp Solutions",
        client_avatar_url: "/images/testimonials/sarah-johnson.jpg",
        testimonial_text:
          "PT Sapujagat Nirmana Tekna transformed our business operations with their innovative IoT platform. The real-time monitoring capabilities have given us unprecedented visibility into our processes.",
      },
      {
        id: "2",
        client_name: "Michael Chen",
        client_position: "CTO",
        client_company: "InnovateTech",
        client_avatar_url: "/images/testimonials/michael-chen.jpg",
        testimonial_text:
          "The mobile app developed by Tekna is exceptional. The offline capabilities and AR features have revolutionized how our field engineers work.",
      },
      {
        id: "3",
        client_name: "Lisa Rodriguez",
        client_position: "Operations Director",
        client_company: "Global Manufacturing",
        client_avatar_url: "/images/testimonials/lisa-rodriguez.jpg",
        testimonial_text:
          "Working with Tekna has been a game-changer for our manufacturing operations. Their ERP system has streamlined our entire workflow.",
      },
    ];
  }

  /**
   * Get featured projects with translations.
   */
  static async getFeaturedProjects(language: string = "en") {
    const supabase = await createClient();
    try {
      // First get the language ID
      const { data: languageData, error: languageError } = await supabase
        .from("languages")
        .select("id")
        .eq("code", language)
        .eq("is_active", true)
        .single();

      if (languageError || !languageData) {
        console.error("Language not found:", language, languageError);
        return [];
      }

      // Get featured projects with translations and images
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select(
          `
          id,
          name,
          slug,
          project_url,
          description,
          featured_image_url,
          is_featured,
          is_active,
          sort_order,
          created_at
        `
        )
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (projectsError) {
        console.error("Error fetching featured projects:", projectsError);
        return [];
      }

      if (!projects || projects.length === 0) return [];

      // Get translations for all projects
      const projectIds = projects.map((p) => p.id);
      const { data: translations, error: translationsError } = await supabase
        .from("project_translations")
        .select(
          `
          project_id,
          description,
          short_description,
          meta_title,
          meta_description,
          meta_keywords
        `
        )
        .in("project_id", projectIds)
        .eq("language_id", languageData.id);

      if (translationsError) {
        console.error(
          "Error fetching project translations:",
          translationsError
        );
      }

      // Get images for all projects
      const { data: images, error: imagesError } = await supabase
        .from("project_images")
        .select(
          `
          project_id,
          image_url,
          alt_text,
          caption,
          sort_order
        `
        )
        .in("project_id", projectIds)
        .order("sort_order", { ascending: true });

      if (imagesError) {
        console.error("Error fetching project images:", imagesError);
      }

      // Transform the data to match the expected interface
      const result = projects.map((project) => {
        const translation = translations?.find(
          (t) => t.project_id === project.id
        );
        const projectImages =
          images?.filter((img) => img.project_id === project.id) || [];

        return {
          id: project.id,
          name: project.name,
          slug: project.slug,
          project_url: project.project_url,
          featured_image_url: project.featured_image_url,
          description: project.description || translation?.description || "",
          short_description: translation?.short_description || "",
          images: projectImages.map((img) => ({
            image_url: img.image_url,
            alt_text: img.alt_text,
            caption: img.caption,
            sort_order: img.sort_order,
          })),
        };
      });

      return result;
    } catch (error) {
      console.error("Error fetching featured projects:", error);
      return [];
    }
  }
}
