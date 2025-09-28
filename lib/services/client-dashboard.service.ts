import { createClient } from "@/lib/supabase/client";
import type { PostStatus } from "@/lib/types/dashboard";

export class ClientDashboardService {
  /**
   * Delete project (soft delete) - Client side
   */
  static async deleteProject(projectId: string) {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("projects")
        .update({ is_active: false })
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  }

  /**
   * Create new project - Client side
   */
  static async createProject(projectData: {
    name: string;
    slug: string;
    project_url?: string;
    description?: string;
    featured_image_url?: string;
    is_featured?: boolean;
    // New detail fields
    overview_content?: string;
    short_description?: string;
    meta_title?: string;
    meta_description?: string;
    technologies?: string;
    client_name?: string;
    project_date?: string;
    project_duration?: string;
    team_size?: string;
    project_status?: string;
    gallery_images?: string[];
  }) {
    const supabase = createClient();

    try {
      // Separate data for different tables
      const {
        overview_content,
        short_description,
        meta_title,
        meta_description,
        gallery_images,
        ...projectBasicData
      } = projectData;

      // Create project in projects table
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          ...projectBasicData,
          is_active: true,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Get default language ID
      const { data: defaultLang } = await supabase
        .from("languages")
        .select("id")
        .eq("is_default", true)
        .single();

      if (defaultLang && (overview_content || short_description || meta_title || meta_description)) {
        // Create project translation
        const translationData = {
          project_id: project.id,
          language_id: defaultLang.id,
          description: overview_content,
          short_description,
          meta_title,
          meta_description,
        };

        // Remove undefined values
        const cleanTranslationData = Object.fromEntries(
          Object.entries(translationData).filter(([, v]) => v !== undefined)
        );

        const { error: translationError } = await supabase
          .from("project_translations")
          .insert(cleanTranslationData);

        if (translationError) {
          console.error("Translation creation error:", translationError);
          // Don't throw here, just log the error
        }
      }

      // Handle gallery images if provided
      if (gallery_images && Array.isArray(gallery_images) && gallery_images.length > 0) {
        const imageInserts = gallery_images.map((imageUrl, index) => ({
          project_id: project.id,
          image_url: imageUrl,
          sort_order: index,
        }));

        const { error: imagesError } = await supabase
          .from("project_images")
          .insert(imageInserts);

        if (imagesError) {
          console.error("Images creation error:", imagesError);
          // Don't throw here, just log the error
        }
      }

      return project;
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error("Failed to create new project");
    }
  }

  /**
   * Update existing project - Client side
   */
  static async updateProject(
    projectId: string,
    projectData: {
      name?: string;
      slug?: string;
      project_url?: string;
      description?: string;
      featured_image_url?: string;
      is_featured?: boolean;
      // New detail fields
      overview_content?: string;
      short_description?: string;
      meta_title?: string;
      meta_description?: string;
      technologies?: string;
      client_name?: string;
      project_date?: string;
      project_duration?: string;
      team_size?: string;
      project_status?: string;
      gallery_images?: string[];
    }
  ) {
    const supabase = createClient();

    try {
      console.log("Updating project with ID:", projectId);
      console.log("Update data:", projectData);

      // Separate data for different tables
      const {
        overview_content,
        short_description,
        meta_title,
        meta_description,
        gallery_images,
        ...projectBasicData
      } = projectData;

      // Update projects table with basic data
      const { data: projectResult, error: projectError } = await supabase
        .from("projects")
        .update(projectBasicData)
        .eq("id", projectId)
        .eq("is_active", true)
        .select()
        .single();

      if (projectError) {
        console.error("Project update error:", projectError);
        throw projectError;
      }

      // Get default language ID
      const { data: defaultLang } = await supabase
        .from("languages")
        .select("id")
        .eq("is_default", true)
        .single();

      if (defaultLang) {
        // Update or create project translation
        const translationData = {
          project_id: projectId,
          language_id: defaultLang.id,
          description: overview_content,
          short_description,
          meta_title,
          meta_description,
        };

        // Remove undefined values
        const cleanTranslationData = Object.fromEntries(
          Object.entries(translationData).filter(([, v]) => v !== undefined)
        );

        if (Object.keys(cleanTranslationData).length > 2) { // More than just project_id and language_id
          const { error: translationError } = await supabase
            .from("project_translations")
            .upsert(cleanTranslationData, {
              onConflict: "project_id,language_id"
            });

          if (translationError) {
            console.error("Translation update error:", translationError);
            // Don't throw here, just log the error
          }
        }
      }

      // Handle gallery images if provided
      if (gallery_images && Array.isArray(gallery_images)) {
        // First, delete existing images
        await supabase
          .from("project_images")
          .delete()
          .eq("project_id", projectId);

        // Then insert new images
        if (gallery_images.length > 0) {
          const imageInserts = gallery_images.map((imageUrl, index) => ({
            project_id: projectId,
            image_url: imageUrl,
            sort_order: index,
          }));

          const { error: imagesError } = await supabase
            .from("project_images")
            .insert(imageInserts);

          if (imagesError) {
            console.error("Images update error:", imagesError);
            // Don't throw here, just log the error
          }
        }
      }

      console.log("Update success, returned data:", projectResult);
      return projectResult;
    } catch (error) {
      console.error("Error updating project:", error);
      throw new Error("Failed to update project");
    }
  }

  /**
   * Get single project by ID - Client side
   */
  static async getProjectById(projectId: string) {
    const supabase = createClient();

    try {
      // Get project basic data
      const { data: project, error: projectError } = await supabase
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
          technologies,
          client_name,
          project_date,
          project_duration,
          team_size,
          project_status,
          created_at,
          updated_at
        `
        )
        .eq("id", projectId)
        .eq("is_active", true)
        .single();

      if (projectError) throw projectError;

      // Get project translations (for default language)
      const { data: translations, error: translationsError } = await supabase
        .from("project_translations")
        .select(`
          id,
          language_id,
          description,
          short_description,
          meta_title,
          meta_description,
          meta_keywords
        `)
        .eq("project_id", projectId)
        .limit(1);

      if (translationsError) {
        console.warn("Error fetching project translations:", translationsError);
      }

      // Get project images
      const { data: images, error: imagesError } = await supabase
        .from("project_images")
        .select(`
          id,
          image_url,
          alt_text,
          caption,
          sort_order
        `)
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true });

      if (imagesError) {
        console.warn("Error fetching project images:", imagesError);
      }

      // Combine all data
      const translation = translations?.[0];
      return {
        ...project,
        // Keep original project description for landing page
        description: project.description,
        // Overview content from project_translations for detail page
        overview_content: translation?.description || "",
        short_description: translation?.short_description || "",
        meta_title: translation?.meta_title || "",
        meta_description: translation?.meta_description || "",
        meta_keywords: translation?.meta_keywords || "",
        gallery_images: images?.map(img => img.image_url) || [],
        images: images || []
      };
    } catch (error) {
      console.error("Error fetching project:", error);
      throw new Error("Failed to fetch project data");
    }
  }

  // ===============================
  // BLOG/POST CRUD OPERATIONS
  // ===============================

  /**
   * Get default language ID
   */
  static async getDefaultLanguageId(): Promise<string> {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("languages")
        .select("id")
        .eq("is_default", true)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error("Error getting default language:", error);
      // Fallback to first available language
      const { data } = await supabase
        .from("languages")
        .select("id")
        .eq("is_active", true)
        .limit(1)
        .single();

      return data?.id || "en"; // Ultimate fallback
    }
  }

  /**
   * Create new blog post - Client side
   */
  static async createPost(postData: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featured_image_url?: string;
    author_name?: string;
    category_id?: string;
    status: PostStatus;
    published_at?: string;
    is_featured?: boolean;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
  }) {
    const supabase = createClient();

    try {
      // Get default language ID
      const defaultLanguageId = await this.getDefaultLanguageId();

      // First, create the main post
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert({
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          content_type: "markdown", // Always use markdown
          featured_image_url: postData.featured_image_url,
          author_name: postData.author_name || null,
          category_id: postData.category_id || null,
          status: postData.status,
          published_at: postData.published_at,
          is_featured: postData.is_featured || false,
          is_active: true,
        })
        .select()
        .single();

      if (postError) throw postError;

      // Then, create the post translation for default language
      if (post && postData.content) {
        const { error: translationError } = await supabase
          .from("post_translations")
          .insert({
            post_id: post.id,
            language_id: defaultLanguageId,
            title: postData.title,
            content: postData.content,
            excerpt: postData.excerpt,
            meta_title: postData.meta_title || postData.title,
            meta_description: postData.meta_description || postData.excerpt,
            meta_keywords: postData.meta_keywords,
          });

        if (translationError) {
          console.error("Error creating post translation:", translationError);
          // Continue anyway as the main post was created
        }
      }

      return post;
    } catch (error) {
      console.error("Error creating post:", error);
      throw new Error("Failed to create new article");
    }
  }

  /**
   * Update existing blog post - Client side
   */
  static async updatePost(
    postId: string,
    postData: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      featured_image_url?: string;
      author_name?: string;
      category_id?: string;
      status?: PostStatus;
      published_at?: string;
      is_featured?: boolean;
      meta_title?: string;
      meta_description?: string;
      meta_keywords?: string;
    }
  ) {
    const supabase = createClient();

    try {
      // Get default language ID
      const defaultLanguageId = await this.getDefaultLanguageId();

      // Update the main post
      const { data: post, error: postError } = await supabase
        .from("posts")
        .update({
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          content_type: "markdown", // Always use markdown
          featured_image_url: postData.featured_image_url,
          author_name: postData.author_name || null,
          category_id: postData.category_id || null,
          status: postData.status,
          published_at: postData.published_at,
          is_featured: postData.is_featured,
        })
        .eq("id", postId)
        .eq("is_active", true)
        .select()
        .single();

      if (postError) throw postError;

      // Update the post translation for default language
      if (
        postData.content ||
        postData.meta_title ||
        postData.meta_description ||
        postData.meta_keywords
      ) {
        const { error: translationError } = await supabase
          .from("post_translations")
          .upsert(
            {
              post_id: postId,
              language_id: defaultLanguageId,
              title: postData.title,
              content: postData.content,
              excerpt: postData.excerpt,
              meta_title: postData.meta_title,
              meta_description: postData.meta_description,
              meta_keywords: postData.meta_keywords,
            },
            {
              onConflict: "post_id,language_id",
            }
          );

        if (translationError) {
          console.error("Error updating post translation:", translationError);
          // Continue anyway as the main post was updated
        }
      }

      return post;
    } catch (error) {
      console.error("Error updating post:", error);
      throw new Error("Failed to update article");
    }
  }

  /**
   * Delete blog post (soft delete) - Client side
   */
  static async deletePost(postId: string) {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("posts")
        .update({ is_active: false })
        .eq("id", postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error("Failed to delete article");
    }
  }

  /**
   * Get single blog post by ID - Client side
   */
  static async getPostById(postId: string) {
    const supabase = createClient();

    try {
      // Get main post data
      const { data: post, error: postError } = await supabase
        .from("posts")
        .select(
          `
            id,
            title,
            slug,
            excerpt,
            content_type,
            featured_image_url,
            author_name,
            category_id,
            status,
            published_at,
            is_featured,
            is_active,
            view_count,
            created_at,
            updated_at
          `
        )
        .eq("id", postId)
        .eq("is_active", true)
        .single();

      if (postError) throw postError;

      // Get post translation content for default language
      if (post) {
        const defaultLanguageId = await this.getDefaultLanguageId();
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
          .eq("post_id", postId)
          .eq("language_id", defaultLanguageId)
          .single();

        if (!translationError && translation) {
          return {
            ...post,
            content: translation.content || "",
            meta_title: translation.meta_title || post.title,
            meta_description: translation.meta_description || post.excerpt,
            meta_keywords: translation.meta_keywords || "",
          };
        }
      }

      return post;
    } catch (error) {
      console.error("Error getting post by ID:", error);
      throw new Error("Failed to fetch article");
    }
  }

  /**
   * Get all categories - Client side
   */
  static async getCategories() {
    const supabase = createClient();

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
          is_active
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
   * Get all authors from existing posts - Client side
   */
  static async getAuthors() {
    const supabase = createClient();

    try {
      // Get unique authors from existing posts
      const { data, error } = await supabase
        .from("posts")
        .select("author_name")
        .not("author_name", "is", null)
        .not("author_name", "eq", "")
        .eq("is_active", true);

      if (error) throw error;

      // Create unique authors list with generated IDs
      const uniqueAuthors = [
        ...new Set(data?.map((post) => post.author_name) || []),
      ];

      return uniqueAuthors.map((name, index) => ({
        id: `author-${index + 1}`,
        first_name: name.split(" ")[0] || name,
        last_name: name.split(" ").slice(1).join(" ") || "",
        position: "Author",
        department: "Content",
        avatar_url: null,
        is_active: true,
      }));
    } catch (error) {
      console.error("Error fetching authors:", error);
      return [];
    }
  }

  /**
   * Get single author by ID - Client side
   */
  static async getAuthorById(authorId: string) {
    try {
      const authors = await this.getAuthors();
      return authors.find((author) => author.id === authorId) || null;
    } catch (error) {
      console.error("Error fetching author:", error);
      throw new Error("Failed to fetch author data");
    }
  }

  /**
   * Create new author - Client side
   * For company profile, authors are just names, not stored separately
   */
  static async createAuthor(authorData: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    position: string;
    department: string;
    avatar_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
    github_url?: string;
    is_active?: boolean;
    sort_order?: number;
  }) {
    // For company profile, we don't store authors separately
    // They are stored as author_name in posts

    return {
      id: `author-${Date.now()}`,
      first_name: authorData.first_name,
      last_name: authorData.last_name,
      position: authorData.position,
      department: authorData.department,
      avatar_url: authorData.avatar_url,
      is_active: true,
    };
  }

  /**
   * Update existing author - Client side
   */
  static async updateAuthor(
    authorId: string,
    authorData: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      position?: string;
      department?: string;
      avatar_url?: string;
      linkedin_url?: string;
      twitter_url?: string;
      github_url?: string;
      is_active?: boolean;
      sort_order?: number;
    }
  ) {
    // For company profile, we don't store authors separately
    // They are stored as author_name in posts

    return {
      id: authorId,
      first_name: authorData.first_name || "",
      last_name: authorData.last_name || "",
      position: authorData.position || "Author",
      department: authorData.department || "Content",
      avatar_url: authorData.avatar_url,
      is_active: authorData.is_active ?? true,
    };
  }

  /**
   * Delete author (soft delete) - Client side
   * For company profile, authors are just names, not stored separately
   */
  static async deleteAuthor(authorId: string) {
    // For company profile, we don't store authors separately
    // They are stored as author_name in posts
    return {
      id: authorId,
      is_active: false,
    };
  }

  /**
   * Get single category by ID - Client side
   */
  static async getCategoryById(categoryId: string) {
    const supabase = createClient();

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
          is_active,
          sort_order,
          created_at,
          updated_at
        `
        )
        .eq("id", categoryId)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw new Error("Failed to fetch category data");
    }
  }

  /**
   * Create new category - Client side
   */
  static async createCategory(categoryData: {
    name: string;
    slug: string;
    description?: string;
    color: string;
    is_active?: boolean;
    sort_order?: number;
  }) {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          ...categoryData,
          is_active: categoryData.is_active ?? true,
          sort_order: categoryData.sort_order || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error("Failed to create new category");
    }
  }

  /**
   * Update existing category - Client side
   */
  static async updateCategory(
    categoryId: string,
    categoryData: {
      name?: string;
      slug?: string;
      description?: string;
      color?: string;
      is_active?: boolean;
      sort_order?: number;
    }
  ) {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("categories")
        .update(categoryData)
        .eq("id", categoryId)
        .eq("is_active", true)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error("Failed to update category");
    }
  }

  /**
   * Delete category (soft delete) - Client side
   */
  static async deleteCategory(categoryId: string) {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("categories")
        .update({ is_active: false })
        .eq("id", categoryId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("Failed to delete category");
    }
  }

  /**
   * Get blog posts - Client side
   */
  static async getBlogPosts() {
    const supabase = createClient();

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
          category_id,
          status,
          published_at,
          is_featured,
          is_active,
          created_at,
          updated_at
        `
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      throw new Error("Failed to fetch blog posts");
    }
  }
}
