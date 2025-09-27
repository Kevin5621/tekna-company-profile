import { createBrowserClient } from "@supabase/ssr";

interface ProjectsFilters {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
}

interface ProjectsResponse {
  data: Array<{
    id: string;
    name: string;
    slug: string;
    project_url?: string;
    featured_image_url?: string;
    description: string;
    short_description?: string;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ProjectDetail {
  id: string;
  name: string;
  slug: string;
  project_url?: string;
  featured_image_url?: string;
  description: string;
  short_description?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  view_count: number;
  images: Array<{
    id: string;
    image_url: string;
    alt_text?: string;
    caption?: string;
    sort_order: number;
  }>;
  translations?: Array<{
    language_id: string;
    description: string;
    short_description?: string;
    meta_title?: string;
    meta_description?: string;
  }>;
}

interface RelatedProject {
  id: string;
  name: string;
  slug: string;
  featured_image_url?: string;
  short_description?: string;
}

export class ClientPublicService {
  private static readonly supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  /**
   * Get all projects with pagination and filtering (client-side)
   */
  static async getAllProjects({
    page = 1,
    limit = 12,
    search,
    featured,
  }: ProjectsFilters = {}): Promise<ProjectsResponse> {
    try {
      const offset = (page - 1) * limit;
      
      // Build the query
      let query = this.supabase
        .from('projects')
        .select(`
          id,
          name,
          slug,
          project_url,
          featured_image_url,
          description,
          short_description:project_translations(short_description),
          is_featured,
          is_active,
          sort_order,
          created_at,
          updated_at
        `, { count: 'exact' })
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      // Add search filter
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      // Add featured filter
      if (featured !== undefined) {
        query = query.eq('is_featured', featured);
      }

      // Add pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      // Process the data to flatten short_description
      const processedData = (data || []).map((project: {
        id: string;
        name: string;
        slug: string;
        project_url?: string;
        featured_image_url?: string;
        description: string;
        short_description?: Array<{ short_description: string }>;
        is_featured: boolean;
        is_active: boolean;
        sort_order: number;
        created_at: string;
        updated_at: string;
      }) => ({
        ...project,
        short_description: project.short_description?.[0]?.short_description || project.description?.substring(0, 150) + '...',
      }));

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        data: processedData,
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
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  /**
   * Get project by slug with full details (client-side)
   */
  static async getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
    try {
      // First get the basic project data
      const { data: project, error: projectError } = await this.supabase
        .from('projects')
        .select(`
          id,
          name,
          slug,
          project_url,
          featured_image_url,
          description,
          is_featured,
          created_at,
          updated_at,
          view_count,
          project_translations(
            language_id,
            description,
            short_description,
            meta_title,
            meta_description
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (projectError || !project) {
        return null;
      }

      // Get project images
      const { data: images, error: imagesError } = await this.supabase
        .from('project_images')
        .select('id, image_url, alt_text, caption, sort_order')
        .eq('project_id', project.id)
        .order('sort_order', { ascending: true });

      if (imagesError) {
        console.error('Error fetching project images:', imagesError);
      }

      return {
        ...project,
        short_description: project.project_translations?.[0]?.short_description || project.description?.substring(0, 150) + '...',
        images: images || [],
        translations: project.project_translations,
      };
    } catch (error) {
      console.error('Error fetching project by slug:', error);
      return null;
    }
  }

  /**
   * Get related projects (client-side)
   */
  static async getRelatedProjects(
    currentProjectId: string,
    limit: number = 3
  ): Promise<RelatedProject[]> {
    try {
      const { data, error } = await this.supabase
        .from('projects')
        .select(`
          id,
          name,
          slug,
          featured_image_url,
          project_translations(short_description)
        `)
        .eq('is_active', true)
        .neq('id', currentProjectId)
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((project: {
        id: string;
        name: string;
        slug: string;
        featured_image_url?: string;
        project_translations?: Array<{ short_description: string }>;
      }) => ({
        ...project,
        short_description: project.project_translations?.[0]?.short_description || 'No description available.',
      }));
    } catch (error) {
      console.error('Error fetching related projects:', error);
      return [];
    }
  }

  /**
   * Increment project view count (client-side)
   */
  static async incrementProjectViews(projectId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .rpc('increment_project_views', { project_id: projectId });

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing project views:', error);
      // Don't throw error as this is not critical
    }
  }
}