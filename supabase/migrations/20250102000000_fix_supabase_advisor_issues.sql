-- Migration to fix Supabase Advisor issues
-- This migration addresses security concerns without changing existing functionality

-- =====================================================
-- 1. FIX SECURITY DEFINER VIEW ISSUE
-- =====================================================

-- Drop the existing view that has SECURITY DEFINER issues
DROP VIEW IF EXISTS published_posts_with_categories;

-- Create a function instead of a view to avoid SECURITY DEFINER issues
-- Function definition moved below with proper search_path setting

-- =====================================================
-- 2. FIX FUNCTION SEARCH PATH MUTABLE ISSUES
-- =====================================================

-- Fix get_media_file_info function
CREATE OR REPLACE FUNCTION get_media_file_info(file_id UUID)
RETURNS TABLE (
    id UUID,
    filename VARCHAR(255),
    original_filename VARCHAR(255),
    file_url TEXT,
    file_size BIGINT,
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mf.id,
        mf.filename,
        mf.original_filename,
        mf.file_url,
        mf.file_size,
        mf.mime_type,
        mf.width,
        mf.height,
        mf.alt_text,
        mf.caption,
        mf.created_at
    FROM media_files mf
    WHERE mf.id = file_id 
    AND mf.is_active = true;
END;
$$;

-- Fix get_media_files_by_folder function
CREATE OR REPLACE FUNCTION get_media_files_by_folder(folder_path TEXT, limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
    id UUID,
    filename VARCHAR(255),
    original_filename VARCHAR(255),
    file_url TEXT,
    file_size BIGINT,
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mf.id,
        mf.filename,
        mf.original_filename,
        mf.file_url,
        mf.file_size,
        mf.mime_type,
        mf.width,
        mf.height,
        mf.alt_text,
        mf.caption,
        mf.created_at
    FROM media_files mf
    WHERE mf.file_path LIKE folder_path || '%'
    AND mf.is_active = true
    ORDER BY mf.created_at DESC
    LIMIT limit_count;
END;
$$;

-- Fix get_paginated_posts function
CREATE OR REPLACE FUNCTION get_paginated_posts(
    search_query TEXT DEFAULT '',
    category_id UUID DEFAULT NULL,
    status_filter TEXT DEFAULT 'published',
    page_number INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 10,
    language_code TEXT DEFAULT 'en'
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    author_name TEXT,
    status TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN,
    total_count BIGINT
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH filtered_posts AS (
        SELECT 
            p.id,
            p.title,
            p.excerpt,
            p.featured_image_url,
            p.author_name,
            p.status,
            p.published_at,
            p.is_featured,
            COUNT(*) OVER() as total_count
        FROM posts p
        LEFT JOIN post_translations pt ON p.id = pt.post_id
        LEFT JOIN languages l ON pt.language_id = l.id
        WHERE p.is_active = true
        AND (search_query = '' OR 
             to_tsvector('english', p.title || ' ' || COALESCE(p.excerpt, '')) @@ plainto_tsquery('english', search_query) OR
             to_tsvector('english', pt.title || ' ' || COALESCE(pt.content, '') || ' ' || COALESCE(pt.excerpt, '')) @@ plainto_tsquery('english', search_query))
        AND (category_id IS NULL OR p.category_id = category_id)
        AND (status_filter = 'all' OR p.status = status_filter)
        AND (language_code = 'all' OR l.code = language_code)
    )
    SELECT 
        fp.id,
        fp.title,
        fp.excerpt,
        fp.featured_image_url,
        fp.author_name,
        fp.status,
        fp.published_at,
        fp.is_featured,
        fp.total_count
    FROM filtered_posts fp
    ORDER BY fp.published_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size;
END;
$$;

-- Fix get_paginated_projects function
CREATE OR REPLACE FUNCTION get_paginated_projects(
    search_query TEXT DEFAULT '',
    page_number INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 10,
    language_code TEXT DEFAULT 'en'
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    project_url TEXT,
    featured_image_url TEXT,
    description TEXT,
    short_description TEXT,
    total_count BIGINT
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH filtered_projects AS (
        SELECT 
            p.id,
            p.name,
            p.slug,
            p.project_url,
            p.featured_image_url,
            pt.description,
            pt.short_description,
            COUNT(*) OVER() as total_count
        FROM projects p
        LEFT JOIN project_translations pt ON p.id = pt.project_id
        LEFT JOIN languages l ON pt.language_id = l.id
        WHERE p.is_active = true
        AND (search_query = '' OR 
             to_tsvector('english', p.name) @@ plainto_tsquery('english', search_query) OR
             to_tsvector('english', pt.description || ' ' || COALESCE(pt.short_description, '')) @@ plainto_tsquery('english', search_query))
        AND (language_code = 'all' OR l.code = language_code)
    )
    SELECT 
        fp.id,
        fp.name,
        fp.slug,
        fp.project_url,
        fp.featured_image_url,
        fp.description,
        fp.short_description,
        fp.total_count
    FROM filtered_projects fp
    ORDER BY fp.created_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size;
END;
$$;

-- Fix get_related_posts function
CREATE OR REPLACE FUNCTION get_related_posts(target_post_id UUID, target_category_id UUID DEFAULT NULL, result_limit INTEGER DEFAULT 3)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    categories JSONB
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.featured_image_url,
        p.published_at,
        p.created_at,
        COALESCE(
            jsonb_build_object(
                'name', c.name,
                'slug', c.slug
            ), 
            'null'::jsonb
        ) as categories
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published' 
    AND p.is_active = true
    AND p.id != target_post_id
    AND (target_category_id IS NULL OR p.category_id = target_category_id)
    ORDER BY 
        CASE WHEN p.category_id = target_category_id THEN 0 ELSE 1 END,
        p.published_at DESC
    LIMIT result_limit;
END;
$$;

-- Fix get_user_role function
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM user_roles
    WHERE user_id = p_user_id AND is_active = true;
    
    RETURN user_role;
END;
$$;

-- Fix increment_applications_count function
CREATE OR REPLACE FUNCTION increment_applications_count(position_id UUID)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE career_positions 
    SET applications_count = applications_count + 1
    WHERE id = position_id;
END;
$$;

-- Fix increment_position_views function
CREATE OR REPLACE FUNCTION increment_position_views(position_id UUID)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE career_positions 
    SET view_count = view_count + 1
    WHERE id = position_id;
END;
$$;

-- Fix increment_post_views function
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE posts 
    SET view_count = view_count + 1
    WHERE id = post_id;
END;
$$;

-- Fix search_published_posts function
CREATE OR REPLACE FUNCTION search_published_posts(search_query TEXT, result_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    author_name TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    categories JSONB
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.featured_image_url,
        p.author_name,
        p.published_at,
        COALESCE(
            jsonb_build_object(
                'id', c.id,
                'name', c.name,
                'slug', c.slug,
                'color', c.color
            ), 
            'null'::jsonb
        ) as categories
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published' 
    AND p.is_active = true
    AND (
        search_query = '' OR 
        p.title ILIKE '%' || search_query || '%' OR
        p.excerpt ILIKE '%' || search_query || '%'
    )
    ORDER BY p.published_at DESC
    LIMIT result_limit;
END;
$$;

-- Fix send_application_notification function
CREATE OR REPLACE FUNCTION send_application_notification(
    application_id UUID,
    notification_type TEXT DEFAULT 'new_application'
)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert notification record
    INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        related_id,
        is_read
    )
    SELECT 
        cp.user_id,
        CASE 
            WHEN notification_type = 'new_application' THEN 'New Application Received'
            WHEN notification_type = 'status_update' THEN 'Application Status Updated'
            ELSE 'Application Notification'
        END,
        CASE 
            WHEN notification_type = 'new_application' THEN 'Your application has been received and is under review.'
            WHEN notification_type = 'status_update' THEN 'Your application status has been updated.'
            ELSE 'You have a new application notification.'
        END,
        'career',
        application_id,
        false
    FROM career_applications ca
    JOIN career_positions cp ON ca.position_id = cp.id
    WHERE ca.id = application_id;
END;
$$;

-- Fix send_application_status_notification function
CREATE OR REPLACE FUNCTION send_application_status_notification(
    application_id UUID,
    new_status TEXT,
    message TEXT DEFAULT NULL
)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert notification record
    INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        related_id,
        is_read
    )
    SELECT 
        cp.user_id,
        'Application Status Updated',
        COALESCE(message, 'Your application status has been updated to: ' || new_status),
        'career',
        application_id,
        false
    FROM career_applications ca
    JOIN career_positions cp ON ca.position_id = cp.id
    WHERE ca.id = application_id;
    
    -- Update application status
    UPDATE career_applications 
    SET status = new_status, updated_at = NOW()
    WHERE id = application_id;
END;
$$;

-- Fix update_partners_updated_at function
CREATE OR REPLACE FUNCTION update_partners_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix get_published_posts_with_categories function (add search_path for SECURITY INVOKER)
CREATE OR REPLACE FUNCTION get_published_posts_with_categories()
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    author_name TEXT,
    category_id UUID,
    status TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN,
    view_count INTEGER,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    categories JSONB
) 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.featured_image_url,
        p.author_name,
        p.category_id,
        p.status,
        p.published_at,
        p.is_featured,
        p.view_count,
        p.is_active,
        p.created_at,
        p.updated_at,
        jsonb_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug,
            'color', c.color,
            'description', c.description
        ) as categories
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published' AND p.is_active = true;
END;
$$;

-- =====================================================
-- 3. FIX AUTH OTP LONG EXPIRY ISSUE
-- =====================================================

-- This will be handled by Supabase configuration
-- Set OTP expiry to 1 hour (3600 seconds) in your Supabase dashboard
-- Go to Authentication > Settings > Email Templates > OTP expiry

-- =====================================================
-- 4. FIX LEAKED PASSWORD PROTECTION ISSUE
-- =====================================================

-- This will be handled by Supabase configuration
-- Go to Authentication > Settings > Password Security > Enable "Leaked password protection"

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions on all fixed functions
GRANT EXECUTE ON FUNCTION get_published_posts_with_categories() TO anon;
GRANT EXECUTE ON FUNCTION get_published_posts_with_categories() TO authenticated;

GRANT EXECUTE ON FUNCTION get_media_file_info(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_media_file_info(UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION get_media_files_by_folder(TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_media_files_by_folder(TEXT, INTEGER) TO authenticated;

GRANT EXECUTE ON FUNCTION get_paginated_posts(TEXT, UUID, TEXT, INTEGER, INTEGER, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_paginated_posts(TEXT, UUID, TEXT, INTEGER, INTEGER, TEXT) TO authenticated;

GRANT EXECUTE ON FUNCTION get_paginated_projects(TEXT, INTEGER, INTEGER, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_paginated_projects(TEXT, INTEGER, INTEGER, TEXT) TO authenticated;

GRANT EXECUTE ON FUNCTION get_related_posts(UUID, UUID, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_related_posts(UUID, UUID, INTEGER) TO authenticated;

GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION increment_applications_count(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_applications_count(UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION increment_position_views(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_position_views(UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION increment_post_views(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_post_views(UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION search_published_posts(TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION search_published_posts(TEXT, INTEGER) TO authenticated;

GRANT EXECUTE ON FUNCTION send_application_notification(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION send_application_notification(UUID, TEXT) TO authenticated;

GRANT EXECUTE ON FUNCTION send_application_status_notification(UUID, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION send_application_status_notification(UUID, TEXT, TEXT) TO authenticated;

GRANT EXECUTE ON FUNCTION update_partners_updated_at() TO anon;
GRANT EXECUTE ON FUNCTION update_partners_updated_at() TO authenticated;

GRANT EXECUTE ON FUNCTION update_updated_at_column() TO anon;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION get_published_posts_with_categories() IS 'Replaces the SECURITY DEFINER view with a SECURITY INVOKER function for better security';
COMMENT ON FUNCTION get_media_file_info(UUID) IS 'Fixed search_path mutable issue by setting search_path = public';
COMMENT ON FUNCTION get_media_files_by_folder(TEXT, INTEGER) IS 'Fixed search_path mutable issue by setting search_path = public';
COMMENT ON FUNCTION get_paginated_posts(TEXT, UUID, TEXT, INTEGER, INTEGER, TEXT) IS 'Fixed search_path mutable issue by setting search_path = public';
COMMENT ON FUNCTION get_paginated_projects(TEXT, INTEGER, INTEGER, TEXT) IS 'Fixed search_path mutable issue by setting search_path = public';
COMMENT ON FUNCTION get_related_posts(UUID, UUID, INTEGER) IS 'Fixed search_path mutable issue by setting search_path = public';
COMMENT ON FUNCTION get_user_role(UUID) IS 'Fixed search_path mutable issue by setting search_path = public';
COMMENT ON FUNCTION increment_applications_count(UUID) IS 'Fixed search_path mutable issue by setting search_path = public';
COMMENT ON FUNCTION increment_position_views(UUID) IS 'Fixed search_path mutable issue by setting search_path = public';
COMMENT ON FUNCTION increment_post_views(UUID) IS 'Fixed search_path mutable issue by setting search_path = public';
COMMENT ON FUNCTION search_published_posts(TEXT, INTEGER) IS 'Fixed search_path mutable issue by setting search_path = public';
COMMENT ON FUNCTION send_application_notification(UUID, TEXT) IS 'Fixed search_path mutable issue by setting search_path = public';
COMMENT ON FUNCTION send_application_status_notification(UUID, TEXT, TEXT) IS 'Fixed search_path mutable issue by setting search_path = public';
COMMENT ON FUNCTION update_partners_updated_at() IS 'Fixed search_path mutable issue by setting search_path = public';
COMMENT ON FUNCTION update_updated_at_column() IS 'Fixed search_path mutable issue by setting search_path = public';
