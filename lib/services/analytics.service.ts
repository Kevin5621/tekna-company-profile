// import { createClient } from "@/lib/supabase/server";

export interface AnalyticsData {
  date: string;
  total_sessions: number;
  total_page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration_seconds: number;
  top_pages: Array<{
    page_path: string;
    page_title: string;
    views: number;
  }>;
  top_referrers: Array<{
    referrer: string;
    count: number;
  }>;
  device_breakdown: Array<{
    device_type: string;
    count: number;
  }>;
}

export interface ChartDataItem {
  date: string;
  website_views: number;
  blog_views: number;
  career_applications: number;
  career_views: number;
}

export class AnalyticsService {
  /**
   * Get analytics data for chart (currently using mock data for cost optimization)
   *
   * NOTE: Database queries are commented out to reduce costs
   * Uncomment the code below when you want to enable real analytics tracking
   */
  static async getChartData(days: number = 30): Promise<ChartDataItem[]> {
    // NOTE: Database tracking is currently disabled for cost optimization
    // Return mock data instead of querying database

    console.log(
      `📊 [AnalyticsService] Using mock data for ${days} days (database tracking disabled)`
    );

    // Return mock data for now
    return this.getFallbackChartData(days);

    /*
    // UNCOMMENT BELOW WHEN READY TO ENABLE REAL ANALYTICS
    
    const supabase = await createClient();
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days + 1); // +1 to include today

      // Get real-time website page views from website_page_views table
      // Use date-only comparison to avoid timezone issues
      const { data: pageViewsData, error: pageViewsError } = await supabase
        .from('website_page_views')
        .select('viewed_at')
        .gte('viewed_at', startDate.toISOString().split('T')[0] + 'T00:00:00')
        .lte('viewed_at', endDate.toISOString().split('T')[0] + 'T23:59:59');

      if (pageViewsError) throw pageViewsError;

      // Get blog posts view counts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          created_at,
          view_count
        `)
        .eq('is_active', true)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (postsError) throw postsError;

      // Get career positions data
      const { data: careerData, error: careerError } = await supabase
        .from('career_positions')
        .select(`
          created_at,
          views_count,
          applications_count
        `)
        .eq('is_active', true)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (careerError) throw careerError;

      // Process data to create daily aggregates
      const dailyData: { [key: string]: { 
        website_views: number; 
        blog_views: number; 
        career_applications: number; 
        career_views: number; 
      } } = {};

      // Initialize all dates in range
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        dailyData[dateKey] = { 
          website_views: 0, 
          blog_views: 0, 
          career_applications: 0, 
          career_views: 0 
        };
      }

      // Aggregate real-time website page views by date
      pageViewsData?.forEach(pageView => {
        const dateKey = pageView.viewed_at.split('T')[0];
        if (dailyData[dateKey]) {
          dailyData[dateKey].website_views += 1;
        }
      });

      // Aggregate blog posts data
      postsData?.forEach(post => {
        const dateKey = post.created_at.split('T')[0];
        if (dailyData[dateKey]) {
          dailyData[dateKey].blog_views += post.view_count || 0;
        }
      });

      // Aggregate career data
      careerData?.forEach(career => {
        const dateKey = career.created_at.split('T')[0];
        if (dailyData[dateKey]) {
          dailyData[dateKey].career_views += career.views_count || 0;
          dailyData[dateKey].career_applications += career.applications_count || 0;
        }
      });

      // Convert to array format for chart
      const chartData = Object.entries(dailyData).map(([date, data]) => ({
        date,
        website_views: data.website_views,
        blog_views: data.blog_views,
        career_applications: data.career_applications,
        career_views: data.career_views
      }));

      return chartData;
    } catch (error) {
      console.error('Error fetching analytics chart data:', error);
      // Return fallback data if there's an error
      return this.getFallbackChartData(days);
    }
    */
  }

  /**
   * Get fallback chart data when database query fails
   */
  private static getFallbackChartData(days: number): ChartDataItem[] {
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];

      // Generate some realistic-looking fallback data
      const baseWebsiteViews = 50 + Math.floor(Math.random() * 100);
      const baseBlogViews = 20 + Math.floor(Math.random() * 50);
      const baseCareerViews = 10 + Math.floor(Math.random() * 30);
      const baseCareerApplications = 2 + Math.floor(Math.random() * 8);

      data.push({
        date: dateKey,
        website_views: baseWebsiteViews,
        blog_views: baseBlogViews,
        career_applications: baseCareerApplications,
        career_views: baseCareerViews,
      });
    }

    return data;
  }

  /**
   * Get analytics overview (currently using mock data for cost optimization)
   *
   * NOTE: Database queries are commented out to reduce costs
   * Uncomment the code below when you want to enable real analytics tracking
   */
  static async getAnalyticsOverview() {
    // NOTE: Database tracking is currently disabled for cost optimization
    // Return mock data instead of querying database

    console.log(
      "📊 [AnalyticsService] Using mock overview data (database tracking disabled)"
    );

    // Return mock data for now
    return {
      today: {
        page_views: 150,
        sessions: 45,
        unique_visitors: 38,
        bounce_rate: 25.5,
        avg_session_duration: 180,
      },
      yesterday: {
        page_views: 120,
        sessions: 32,
        unique_visitors: 28,
      },
      weekly_total: 850,
      monthly_total: 3200,
      top_pages: [
        { page_path: "/", page_title: "Home", views: 45 },
        { page_path: "/blog", page_title: "Blog", views: 28 },
        { page_path: "/career", page_title: "Career", views: 22 },
        { page_path: "/about", page_title: "About", views: 18 },
        { page_path: "/contact", page_title: "Contact", views: 15 },
      ],
      top_referrers: [
        { referrer: "google.com", count: 25 },
        { referrer: "facebook.com", count: 18 },
        { referrer: "linkedin.com", count: 12 },
      ],
      device_breakdown: [
        { device_type: "desktop", count: 65 },
        { device_type: "mobile", count: 28 },
        { device_type: "tablet", count: 7 },
      ],
    };

    /*
    // UNCOMMENT BELOW WHEN READY TO ENABLE REAL ANALYTICS
    
    const supabase = await createClient();
    
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setDate(lastMonth.getDate() - 30);

      // Get today's real-time page views
      const { data: todayPageViews, error: todayError } = await supabase
        .from('website_page_views')
        .select('*')
        .gte('viewed_at', today.toISOString().split('T')[0] + 'T00:00:00')
        .lt('viewed_at', today.toISOString().split('T')[0] + 'T23:59:59');

      if (todayError) throw todayError;

      // Get yesterday's real-time page views
      const { data: yesterdayPageViews, error: yesterdayError } = await supabase
        .from('website_page_views')
        .select('*')
        .gte('viewed_at', yesterday.toISOString().split('T')[0] + 'T00:00:00')
        .lt('viewed_at', yesterday.toISOString().split('T')[0] + 'T23:59:59');

      if (yesterdayError) throw yesterdayError;

      // Get last week's real-time page views
      const { data: lastWeekPageViews, error: weekError } = await supabase
        .from('website_page_views')
        .select('*')
        .gte('viewed_at', lastWeek.toISOString())
        .lt('viewed_at', today.toISOString());

      if (weekError) throw weekError;

      // Get last month's real-time page views
      const { data: lastMonthPageViews, error: monthError } = await supabase
        .from('website_page_views')
        .select('*')
        .gte('viewed_at', lastMonth.toISOString())
        .lt('viewed_at', today.toISOString());

      if (monthError) throw monthError;

      // Get today's sessions
      const { data: todaySessions, error: sessionsError } = await supabase
        .from('website_sessions')
        .select('*')
        .gte('started_at', today.toISOString().split('T')[0] + 'T00:00:00')
        .lt('started_at', today.toISOString().split('T')[0] + 'T23:59:59');

      if (sessionsError) throw sessionsError;

      // Calculate unique visitors (unique session IDs)
      const uniqueVisitorsToday = new Set(todaySessions?.map(s => s.session_id)).size;
      const uniqueVisitorsYesterday = new Set(yesterdayPageViews?.map(p => p.session_id)).size;

      // Calculate top pages for today
      const pageViewsByPath = todayPageViews?.reduce((acc, pageView) => {
        const path = pageView.page_path;
        acc[path] = (acc[path] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }) || {};

      const topPages = Object.entries(pageViewsByPath)
        .map(([page_path, views]) => ({ page_path, page_title: page_path, views: views as number }))
        .sort((a, b) => (b.views as number) - (a.views as number))
        .slice(0, 10);

      return {
        today: {
          page_views: todayPageViews?.length || 0,
          sessions: todaySessions?.length || 0,
          unique_visitors: uniqueVisitorsToday,
          bounce_rate: 0, // Would need more complex calculation
          avg_session_duration: 0 // Would need more complex calculation
        },
        yesterday: {
          page_views: yesterdayPageViews?.length || 0,
          sessions: 0, // Would need separate query
          unique_visitors: uniqueVisitorsYesterday
        },
        weekly_total: lastWeekPageViews?.length || 0,
        monthly_total: lastMonthPageViews?.length || 0,
        top_pages: topPages,
        top_referrers: [], // Would need separate calculation
        device_breakdown: [] // Would need separate calculation
      };
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      return {
        today: { page_views: 0, sessions: 0, unique_visitors: 0, bounce_rate: 0, avg_session_duration: 0 },
        yesterday: { page_views: 0, sessions: 0, unique_visitors: 0 },
        weekly_total: 0,
        monthly_total: 0,
        top_pages: [],
        top_referrers: [],
        device_breakdown: []
      };
    }
    */
  }

  /**
   * Record a page view (for client-side tracking)
   *
   * NOTE: Currently disabled for cost optimization
   */
  static async recordPageView() {
    // NOTE: Database tracking is currently disabled for cost optimization
    console.log(
      "📊 [AnalyticsService] Page view tracking disabled (mock mode)"
    );
    return { id: "mock-page-view-id" };

    /*
    // UNCOMMENT BELOW WHEN READY TO ENABLE REAL ANALYTICS
    
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase.rpc('record_page_view', {
        p_session_id: pageData.sessionId,
        p_page_path: pageData.pagePath,
        p_page_title: pageData.pageTitle || null,
        p_page_type: pageData.pageType || null,
        p_referrer_path: pageData.referrerPath || null,
        p_time_on_page_seconds: pageData.timeOnPage || null,
        p_scroll_depth_percentage: pageData.scrollDepth || null,
        p_is_exit: pageData.isExit || false
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording page view:', error);
      return null;
    }
    */
  }

  /**
   * Create or update session (for client-side tracking)
   *
   * NOTE: Currently disabled for cost optimization
   */
  static async createOrUpdateSession() {
    // NOTE: Database tracking is currently disabled for cost optimization
    console.log("📊 [AnalyticsService] Session tracking disabled (mock mode)");
    return { id: "mock-session-id" };

    /*
    // UNCOMMENT BELOW WHEN READY TO ENABLE REAL ANALYTICS
    
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase.rpc('create_or_update_session', {
        p_session_id: sessionData.sessionId,
        p_user_agent: sessionData.userAgent || null,
        p_ip_address: sessionData.ipAddress || null,
        p_referrer: sessionData.referrer || null,
        p_utm_source: sessionData.utmSource || null,
        p_utm_medium: sessionData.utmMedium || null,
        p_utm_campaign: sessionData.utmCampaign || null,
        p_device_type: sessionData.deviceType || null,
        p_browser: sessionData.browser || null,
        p_os: sessionData.os || null,
        p_country: sessionData.country || null,
        p_city: sessionData.city || null
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating/updating session:', error);
      return null;
    }
    */
  }

  /**
   * End session (for client-side tracking)
   *
   * NOTE: Currently disabled for cost optimization
   */
  static async endSession() {
    // NOTE: Database tracking is currently disabled for cost optimization
    console.log("📊 [AnalyticsService] Session ending disabled (mock mode)");
    return true;

    /*
    // UNCOMMENT BELOW WHEN READY TO ENABLE REAL ANALYTICS
    
    const supabase = await createClient();
    
    try {
      const { error } = await supabase.rpc('end_session', {
        p_session_id: sessionId,
        p_duration_seconds: durationSeconds || null
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error ending session:', error);
      return false;
    }
    */
  }
}
