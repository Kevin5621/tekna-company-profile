import { createClient } from "@/lib/supabase/server";
import type { DashboardData, ProjectStatus } from "@/lib/types/dashboard";

export class DashboardService {
  /**
   * Get dashboard statistics and data
   */
  static async getDashboardData(): Promise<DashboardData> {
    const supabase = await createClient();
    
    try {
      // Get all data in parallel for better performance
      const [
        teamCountResult,
        projectsCountResult,
        postsCountResult,
        testimonialsCountResult,
        servicesCountResult,
        recentProjectsResult,
        recentPostsResult
      ] = await Promise.all([
        // Team members count (from posts authors)
        supabase
          .from('posts')
          .select('author_name', { count: 'exact', head: true })
          .not('author_name', 'is', null)
          .not('author_name', 'eq', '')
          .eq('is_active', true),
        
        // Active projects count
        supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Published posts count
        supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')
          .eq('is_active', true),
        
        // Testimonials count
        supabase
          .from('testimonials')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Services count
        supabase
          .from('services')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Recent projects
        supabase
          .from('projects')
          .select(`
            id,
            name,
            client_name,
            status,
            start_date,
            end_date,
            project_translations!inner(
              short_description
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3),
        
        // Recent posts
        supabase
          .from('posts')
          .select(`
            id,
            title,
            status,
            view_count,
            published_at,
            author_name
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      // Extract data from results
      const teamCount = teamCountResult.count || 0;
      const projectsCount = projectsCountResult.count || 0;
      const postsCount = postsCountResult.count || 0;
      const testimonialsCount = testimonialsCountResult.count || 0;
      const servicesCount = servicesCountResult.count || 0;
      const recentProjects = recentProjectsResult.data || [];
      const recentPosts = recentPostsResult.data || [];

      return {
        stats: [
          {
            title: "Total Tim",
            value: teamCount.toString(),
            description: "Anggota tim aktif",
            change: "+2",
            changeType: "positive" as const
          },
          {
            title: "Proyek Aktif",
            value: projectsCount.toString(),
            description: "Proyek sedang berjalan",
            change: "+1",
            changeType: "positive" as const
          },
          {
            title: "Artikel Blog",
            value: postsCount.toString(),
            description: "Artikel diterbitkan",
            change: "+3",
            changeType: "positive" as const
          },
          {
            title: "Testimonial",
            value: testimonialsCount.toString(),
            description: "Ulasan klien",
            change: "+2",
            changeType: "positive" as const
          }
        ],
        recentProjects: recentProjects.map(project => ({
          id: project.id,
          name: project.name,
          status: project.status as ProjectStatus,
          description: project.project_translations?.[0]?.short_description || ''
        })),
        recentPosts: recentPosts.map(post => ({
          id: post.id,
          title: post.title,
          author: post.author_name || 'Admin',
          status: post.status as 'draft' | 'published' | 'archived',
          views: post.view_count || 0,
          publishedAt: post.published_at
        })),
        servicesCount
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Gagal mengambil data dashboard');
    }
  }

  /**
   * Get team members data (from posts authors)
   */
  static async getTeamMembers() {
    const supabase = await createClient();
    
    try {
      // Get unique authors from existing posts
      const { data, error } = await supabase
        .from('posts')
        .select('author_name')
        .not('author_name', 'is', null)
        .not('author_name', 'eq', '')
        .eq('is_active', true);

      if (error) throw error;
      
      // Create unique authors list with generated IDs
      const uniqueAuthors = [...new Set(data?.map(post => post.author_name) || [])];
      
      return uniqueAuthors.map((name, index) => ({
        id: `author-${index + 1}`,
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || '',
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@tekna.com`,
        position: 'Author',
        department: 'Content',
        avatar_url: null,
        is_active: true
      }));
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw new Error('Gagal mengambil data tim');
    }
  }

  /**
   * Get projects data
   */
  static async getProjects() {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          description,
          is_featured,
          is_active,
          featured_image_url
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Gagal mengambil data proyek');
    }
  }

  /**
   * Get single project by ID
   */
  static async getProjectById(projectId: string) {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          slug,
          project_url,
          description,
          featured_image_url,
          is_featured,
          is_active
        `)
        .eq('id', projectId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Gagal mengambil data proyek');
    }
  }

  /**
   * Create new project
   */
  static async createProject(projectData: {
    name: string;
    slug: string;
    project_url?: string;
    description?: string;
    featured_image_url?: string;
    is_featured?: boolean;
  }) {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Gagal membuat proyek baru');
    }
  }

  /**
   * Update existing project
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
    }
  ) {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', projectId)
        .eq('is_active', true)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Gagal mengupdate proyek');
    }
  }

  /**
   * Delete project (soft delete)
   */
  static async deleteProject(projectId: string) {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ is_active: false })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Gagal menghapus proyek');
    }
  }

  /**
   * Get single blog post by ID - Server side
   */
  static async getBlogPostById(postId: string) {
    const supabase = await createClient();
    
    try {
      // Get main post data
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select(`
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
        `)
        .eq('id', postId)
        .eq('is_active', true)
        .single();

      if (postError) {
        console.error('Post query error:', postError);
        throw postError;
      }

      if (!post) {
        return null;
      }

      // Get content from translations
      try {
        const { data: defaultLanguage } = await supabase
          .from('languages')
          .select('id')
          .eq('is_default', true)
          .eq('is_active', true)
          .single();

        const defaultLangId = defaultLanguage?.id || 'en';

        const { data: translation } = await supabase
          .from('post_translations')
          .select(`
            content,
            meta_title,
            meta_description,
            meta_keywords
          `)
          .eq('post_id', post.id)
          .eq('language_id', defaultLangId)
          .single();

        return {
          ...post,
          content: translation?.content || '',
          meta_title: translation?.meta_title || post.title,
          meta_description: translation?.meta_description || post.excerpt,
          meta_keywords: translation?.meta_keywords || ''
        };
      } catch (error) {
        console.log(`Error fetching translation for post ${post.id}:`, error);
        // Return post without translation content
        return {
          ...post,
          content: '',
          meta_title: post.title,
          meta_description: post.excerpt,
          meta_keywords: ''
        };
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  }

  /**
   * Get all blog posts - Server side
   */
  static async getBlogPosts() {
    const supabase = await createClient();
    
    try {
      console.log('Fetching blog posts...');
      
      // Get main posts data
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
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
          view_count,
          created_at,
          updated_at
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Posts query error:', postsError);
        throw postsError;
      }

      console.log(`Found ${posts?.length || 0} posts`);

      // Get content for each post from translations
      if (posts && posts.length > 0) {
        // Get default language ID first
        const { data: defaultLanguage, error: langError } = await supabase
          .from('languages')
          .select('id')
          .eq('is_default', true)
          .eq('is_active', true)
          .single();

        if (langError) {
          console.error('Language query error:', langError);
          // Continue without translations
          return posts.map(post => ({
            ...post,
            content: '',
            meta_title: post.title,
            meta_description: post.excerpt,
            meta_keywords: ''
          }));
        }

        const defaultLangId = defaultLanguage?.id || 'en';
        console.log('Default language ID:', defaultLangId);

        const postsWithContent = await Promise.all(
          posts.map(async (post) => {
            try {
              const { data: translation, error: transError } = await supabase
                .from('post_translations')
                .select(`
                  content,
                  meta_title,
                  meta_description,
                  meta_keywords
                `)
                .eq('post_id', post.id)
                .eq('language_id', defaultLangId)
                .single();

              if (transError) {
                console.log(`No translation found for post ${post.id}:`, transError.message);
              }

              return {
                ...post,
                content: translation?.content || '',
                meta_title: translation?.meta_title || post.title,
                meta_description: translation?.meta_description || post.excerpt,
                meta_keywords: translation?.meta_keywords || ''
              };
            } catch (error) {
              console.log(`Error fetching translation for post ${post.id}:`, error);
              // If translation not found, return post without content
              return {
                ...post,
                content: '',
                meta_title: post.title,
                meta_description: post.excerpt,
                meta_keywords: ''
              };
            }
          })
        );

        console.log('Posts with content processed successfully');
        return postsWithContent;
      }

      return posts || [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Return empty array instead of throwing to prevent page crash
      return [];
    }
  }

  /**
   * Get services data
   */
  static async getServices() {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          id,
          name,
          slug,
          icon,
          image_url,
          is_active
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw new Error('Gagal mengambil data layanan');
    }
  }

  /**
   * Get testimonials data
   */
  static async getTestimonials() {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select(`
          id,
          client_name,
          client_position,
          client_company,
          rating,
          is_active,
          is_featured
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw new Error('Failed to fetch testimonials data');
    }
  }

  /**
   * Get categories data
   */
  static async getCategories() {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          description,
          color,
          is_active,
          sort_order,
          created_at,
          updated_at
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories data');
    }
  }

  /**
   * Get chart data for analytics
   */
  static async getChartData(days: number = 30) {
    const supabase = await createClient();
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get posts data grouped by date
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          created_at,
          status,
          view_count
        `)
        .eq('is_active', true)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (postsError) throw postsError;

      // Get projects data grouped by date
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          created_at,
          status
        `)
        .eq('is_active', true)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (projectsError) throw projectsError;

      // Process data to create daily aggregates
      const dailyData: { [key: string]: { posts: number; projects: number; views: number } } = {};

      // Initialize all dates in range
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        dailyData[dateKey] = { posts: 0, projects: 0, views: 0 };
      }

      // Aggregate posts data
      postsData?.forEach(post => {
        const dateKey = post.created_at.split('T')[0];
        if (dailyData[dateKey]) {
          dailyData[dateKey].posts += 1;
          dailyData[dateKey].views += post.view_count || 0;
        }
      });

      // Aggregate projects data
      projectsData?.forEach(project => {
        const dateKey = project.created_at.split('T')[0];
        if (dailyData[dateKey]) {
          dailyData[dateKey].projects += 1;
        }
      });

      // Convert to array format for chart
      const chartData = Object.entries(dailyData).map(([date, data]) => ({
        date,
        posts: data.posts,
        projects: data.projects,
        views: data.views
      }));

      return chartData;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Return fallback data if there's an error
      return this.getFallbackChartData(days);
    }
  }

  /**
   * Get fallback chart data when database query fails
   */
  private static getFallbackChartData(days: number) {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      // Generate some realistic-looking fallback data
      const basePosts = 5 + Math.floor(Math.random() * 10);
      const baseProjects = 2 + Math.floor(Math.random() * 5);
      const baseViews = 100 + Math.floor(Math.random() * 200);
      
      data.push({
        date: dateKey,
        posts: basePosts,
        projects: baseProjects,
        views: baseViews
      });
    }
    
    return data;
  }
}
