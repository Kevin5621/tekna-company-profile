-- Migration: Website Analytics System
-- Description: Comprehensive analytics tracking for website views, sessions, and page analytics
-- Created: 2025-01-01

-- =====================================================
-- WEBSITE ANALYTICS SYSTEM
-- =====================================================

-- Website sessions table
CREATE TABLE website_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL UNIQUE,
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    device_type VARCHAR(50), -- desktop, mobile, tablet
    browser VARCHAR(100),
    os VARCHAR(100),
    country VARCHAR(2),
    city VARCHAR(100),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    page_views_count INTEGER DEFAULT 0,
    is_bounce BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Website page views table
CREATE TABLE website_page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL,
    page_path VARCHAR(500) NOT NULL,
    page_title VARCHAR(255),
    page_type VARCHAR(100), -- home, blog, career, about, contact, etc.
    referrer_path VARCHAR(500),
    time_on_page_seconds INTEGER,
    scroll_depth_percentage INTEGER,
    is_exit BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily analytics aggregates table
CREATE TABLE daily_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    total_sessions INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    avg_session_duration_seconds INTEGER DEFAULT 0,
    top_pages JSONB, -- Store top pages as JSON
    top_referrers JSONB, -- Store top referrers as JSON
    device_breakdown JSONB, -- Store device breakdown as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Website sessions indexes
CREATE INDEX idx_website_sessions_started_at ON website_sessions(started_at);
CREATE INDEX idx_website_sessions_session_id ON website_sessions(session_id);

-- Website page views indexes
CREATE INDEX idx_website_page_views_session_id ON website_page_views(session_id);
CREATE INDEX idx_website_page_views_viewed_at ON website_page_views(viewed_at);
CREATE INDEX idx_website_page_views_page_path ON website_page_views(page_path);

-- Daily analytics indexes
CREATE INDEX idx_daily_analytics_date ON daily_analytics(date);

-- =====================================================
-- FUNCTIONS FOR ANALYTICS
-- =====================================================

-- Function to create or update website session
CREATE OR REPLACE FUNCTION create_or_update_session(
    p_session_id VARCHAR(255),
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL,
    p_utm_source VARCHAR(100) DEFAULT NULL,
    p_utm_medium VARCHAR(100) DEFAULT NULL,
    p_utm_campaign VARCHAR(100) DEFAULT NULL,
    p_device_type VARCHAR(50) DEFAULT NULL,
    p_browser VARCHAR(100) DEFAULT NULL,
    p_os VARCHAR(100) DEFAULT NULL,
    p_country VARCHAR(2) DEFAULT NULL,
    p_city VARCHAR(100) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    session_uuid UUID;
BEGIN
    -- Try to find existing session
    SELECT id INTO session_uuid 
    FROM website_sessions 
    WHERE session_id = p_session_id;
    
    IF session_uuid IS NULL THEN
        -- Create new session
        INSERT INTO website_sessions (
            session_id, user_agent, ip_address, referrer, 
            utm_source, utm_medium, utm_campaign, device_type, 
            browser, os, country, city
        ) VALUES (
            p_session_id, p_user_agent, p_ip_address, p_referrer,
            p_utm_source, p_utm_medium, p_utm_campaign, p_device_type,
            p_browser, p_os, p_country, p_city
        ) RETURNING id INTO session_uuid;
    ELSE
        -- Update existing session
        UPDATE website_sessions 
        SET 
            page_views_count = page_views_count + 1,
            is_bounce = FALSE,
            updated_at = NOW()
        WHERE id = session_uuid;
    END IF;
    
    RETURN session_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record page view
CREATE OR REPLACE FUNCTION record_page_view(
    p_session_id VARCHAR(255),
    p_page_path VARCHAR(500),
    p_page_title VARCHAR(255) DEFAULT NULL,
    p_page_type VARCHAR(100) DEFAULT NULL,
    p_referrer_path VARCHAR(500) DEFAULT NULL,
    p_time_on_page_seconds INTEGER DEFAULT NULL,
    p_scroll_depth_percentage INTEGER DEFAULT NULL,
    p_is_exit BOOLEAN DEFAULT FALSE
)
RETURNS UUID AS $$
DECLARE
    page_view_uuid UUID;
BEGIN
    -- Record the page view
    INSERT INTO website_page_views (
        session_id, page_path, page_title, page_type, 
        referrer_path, time_on_page_seconds, scroll_depth_percentage, is_exit
    ) VALUES (
        p_session_id, p_page_path, p_page_title, p_page_type,
        p_referrer_path, p_time_on_page_seconds, p_scroll_depth_percentage, p_is_exit
    ) RETURNING id INTO page_view_uuid;
    
    -- Update session page views count
    UPDATE website_sessions 
    SET page_views_count = page_views_count + 1
    WHERE session_id = p_session_id;
    
    RETURN page_view_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to end session
CREATE OR REPLACE FUNCTION end_session(
    p_session_id VARCHAR(255),
    p_duration_seconds INTEGER DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE website_sessions 
    SET 
        ended_at = NOW(),
        duration_seconds = COALESCE(p_duration_seconds, 
            EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER)
    WHERE session_id = p_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to aggregate daily analytics
CREATE OR REPLACE FUNCTION aggregate_daily_analytics(p_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
DECLARE
    total_sessions_count INTEGER;
    total_page_views_count INTEGER;
    unique_visitors_count INTEGER;
    bounce_rate_value DECIMAL(5,2);
    avg_duration INTEGER;
    top_pages_json JSONB;
    top_referrers_json JSONB;
    device_breakdown_json JSONB;
BEGIN
    -- Get total sessions for the date
    SELECT COUNT(*) INTO total_sessions_count
    FROM website_sessions 
    WHERE DATE(started_at) = p_date;
    
    -- Get total page views for the date
    SELECT COUNT(*) INTO total_page_views_count
    FROM website_page_views 
    WHERE DATE(viewed_at) = p_date;
    
    -- Get unique visitors (sessions) for the date
    SELECT COUNT(DISTINCT session_id) INTO unique_visitors_count
    FROM website_sessions 
    WHERE DATE(started_at) = p_date;
    
    -- Calculate bounce rate
    SELECT 
        CASE 
            WHEN total_sessions_count > 0 THEN 
                (COUNT(*) FILTER (WHERE is_bounce = TRUE) * 100.0 / total_sessions_count)
            ELSE 0 
        END INTO bounce_rate_value
    FROM website_sessions 
    WHERE DATE(started_at) = p_date;
    
    -- Calculate average session duration
    SELECT 
        CASE 
            WHEN total_sessions_count > 0 THEN 
                AVG(COALESCE(duration_seconds, 0))::INTEGER
            ELSE 0 
        END INTO avg_duration
    FROM website_sessions 
    WHERE DATE(started_at) = p_date;
    
    -- Get top pages
    SELECT jsonb_agg(
        jsonb_build_object(
            'page_path', page_path,
            'page_title', page_title,
            'views', views_count
        )
    ) INTO top_pages_json
    FROM (
        SELECT 
            page_path,
            page_title,
            COUNT(*) as views_count
        FROM website_page_views 
        WHERE DATE(viewed_at) = p_date
        GROUP BY page_path, page_title
        ORDER BY views_count DESC
        LIMIT 10
    ) top_pages;
    
    -- Get top referrers
    SELECT jsonb_agg(
        jsonb_build_object(
            'referrer', referrer,
            'count', ref_count
        )
    ) INTO top_referrers_json
    FROM (
        SELECT 
            referrer,
            COUNT(*) as ref_count
        FROM website_sessions 
        WHERE DATE(started_at) = p_date AND referrer IS NOT NULL
        GROUP BY referrer
        ORDER BY ref_count DESC
        LIMIT 10
    ) top_refs;
    
    -- Get device breakdown
    SELECT jsonb_agg(
        jsonb_build_object(
            'device_type', device_type,
            'count', device_count
        )
    ) INTO device_breakdown_json
    FROM (
        SELECT 
            COALESCE(device_type, 'unknown') as device_type,
            COUNT(*) as device_count
        FROM website_sessions 
        WHERE DATE(started_at) = p_date
        GROUP BY device_type
        ORDER BY device_count DESC
    ) devices;
    
    -- Insert or update daily analytics
    INSERT INTO daily_analytics (
        date, total_sessions, total_page_views, unique_visitors,
        bounce_rate, avg_session_duration_seconds, top_pages, 
        top_referrers, device_breakdown
    ) VALUES (
        p_date, total_sessions_count, total_page_views_count, unique_visitors_count,
        bounce_rate_value, avg_duration, top_pages_json, 
        top_referrers_json, device_breakdown_json
    )
    ON CONFLICT (date) DO UPDATE SET
        total_sessions = EXCLUDED.total_sessions,
        total_page_views = EXCLUDED.total_page_views,
        unique_visitors = EXCLUDED.unique_visitors,
        bounce_rate = EXCLUDED.bounce_rate,
        avg_session_duration_seconds = EXCLUDED.avg_session_duration_seconds,
        top_pages = EXCLUDED.top_pages,
        top_referrers = EXCLUDED.top_referrers,
        device_breakdown = EXCLUDED.device_breakdown,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for updated_at on website_sessions
CREATE TRIGGER update_website_sessions_updated_at
    BEFORE UPDATE ON website_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updated_at on daily_analytics
CREATE TRIGGER update_daily_analytics_updated_at
    BEFORE UPDATE ON daily_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on analytics tables
ALTER TABLE website_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;

-- Allow public insert for tracking (anonymous users can create sessions and page views)
CREATE POLICY "Allow public insert sessions" ON website_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert page views" ON website_page_views FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read analytics data
CREATE POLICY "Allow authenticated read sessions" ON website_sessions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read page views" ON website_page_views FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read daily analytics" ON daily_analytics FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admin users to manage analytics data
CREATE POLICY "Allow admin manage sessions" ON website_sessions FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);
CREATE POLICY "Allow admin manage page views" ON website_page_views FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);
CREATE POLICY "Allow admin manage daily analytics" ON daily_analytics FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION create_or_update_session(VARCHAR, TEXT, INET, TEXT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR) TO anon;
GRANT EXECUTE ON FUNCTION create_or_update_session(VARCHAR, TEXT, INET, TEXT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION record_page_view(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, INTEGER, INTEGER, BOOLEAN) TO anon;
GRANT EXECUTE ON FUNCTION record_page_view(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, INTEGER, INTEGER, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION end_session(VARCHAR, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION end_session(VARCHAR, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION aggregate_daily_analytics(DATE) TO authenticated;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
