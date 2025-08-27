// import { createClient } from "@/lib/supabase/client";

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

export class AnalyticsClientService {
  /**
   * Record a page view (for client-side tracking)
   *
   * NOTE: Currently disabled for cost optimization
   */
  static async recordPageView() {
    // NOTE: Database tracking is currently disabled for cost optimization
    console.log(
      "📊 [AnalyticsClientService] Page view tracking disabled (mock mode)"
    );
    return { id: "mock-page-view-id" };

    /*
    // UNCOMMENT BELOW WHEN READY TO ENABLE REAL ANALYTICS
    
    const supabase = createClient();
    
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
    console.log(
      "📊 [AnalyticsClientService] Session tracking disabled (mock mode)"
    );
    return { id: "mock-session-id" };

    /*
    // UNCOMMENT BELOW WHEN READY TO ENABLE REAL ANALYTICS
    
    const supabase = createClient();
    
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
      return false;
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
    console.log(
      "📊 [AnalyticsClientService] Session ending disabled (mock mode)"
    );
    return true;

    /*
    // UNCOMMENT BELOW WHEN READY TO ENABLE REAL ANALYTICS
    
    const supabase = createClient();
    
    try {
      const { error } = await supabase.rpc('end_session', {
        p_session_id: sessionId,
        durationSeconds || null
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
