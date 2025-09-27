-- Migration: Enhance Projects for Detail Pages
-- Description: Add indexes and functions for project detail functionality
-- Created: 2025-09-27

-- =====================================================
-- PERFORMANCE INDEXES FOR PROJECT DETAILS
-- =====================================================

-- Index for project slug lookups (critical for detail pages)
CREATE INDEX IF NOT EXISTS idx_projects_slug_active ON projects(slug) WHERE is_active = true;

-- Index for featured projects ordering
CREATE INDEX IF NOT EXISTS idx_projects_featured_sort ON projects(is_featured, sort_order, created_at) WHERE is_active = true;

-- Index for project translations by language
CREATE INDEX IF NOT EXISTS idx_project_translations_lookup ON project_translations(project_id, language_id);

-- =====================================================
-- HELPER FUNCTIONS FOR PROJECT DETAILS
-- =====================================================

-- Function to get project by slug with translations
CREATE OR REPLACE FUNCTION get_project_by_slug(project_slug TEXT, language_code TEXT DEFAULT 'en')
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    slug VARCHAR(255),
    project_url VARCHAR(255),
    description TEXT,
    featured_image_url TEXT,
    is_featured BOOLEAN,
    is_active BOOLEAN,
    sort_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    translated_description TEXT,
    short_description VARCHAR(500),
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    lang_id UUID;
BEGIN
    -- Get language ID
    SELECT l.id INTO lang_id 
    FROM languages l 
    WHERE l.code = language_code AND l.is_active = true
    LIMIT 1;
    
    -- If language not found, try to get default (English)
    IF lang_id IS NULL THEN
        SELECT l.id INTO lang_id 
        FROM languages l 
        WHERE l.code = 'en' AND l.is_active = true
        LIMIT 1;
    END IF;

    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.slug,
        p.project_url,
        p.description,
        p.featured_image_url,
        p.is_featured,
        p.is_active,
        p.sort_order,
        p.created_at,
        p.updated_at,
        COALESCE(pt.description, p.description) as translated_description,
        pt.short_description,
        pt.meta_title,
        pt.meta_description,
        pt.meta_keywords
    FROM projects p
    LEFT JOIN project_translations pt ON p.id = pt.project_id AND pt.language_id = lang_id
    WHERE p.slug = project_slug 
    AND p.is_active = true;
END;
$$;

-- Function to get project images by project ID
CREATE OR REPLACE FUNCTION get_project_images(project_id UUID)
RETURNS TABLE (
    id UUID,
    image_url TEXT,
    alt_text VARCHAR(255),
    caption TEXT,
    sort_order INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pi.id,
        pi.image_url,
        pi.alt_text,
        pi.caption,
        pi.sort_order
    FROM project_images pi
    WHERE pi.project_id = get_project_images.project_id
    ORDER BY pi.sort_order ASC, pi.created_at ASC;
END;
$$;

-- Function to get related projects (same type, excluding current)
CREATE OR REPLACE FUNCTION get_related_projects(
    current_project_id UUID, 
    language_code TEXT DEFAULT 'en',
    limit_count INTEGER DEFAULT 3
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    slug VARCHAR(255),
    project_url VARCHAR(255),
    featured_image_url TEXT,
    description TEXT,
    short_description VARCHAR(500),
    is_featured BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    lang_id UUID;
BEGIN
    -- Get language ID
    SELECT l.id INTO lang_id 
    FROM languages l 
    WHERE l.code = language_code AND l.is_active = true
    LIMIT 1;
    
    -- If language not found, try to get default (English)
    IF lang_id IS NULL THEN
        SELECT l.id INTO lang_id 
        FROM languages l 
        WHERE l.code = 'en' AND l.is_active = true
        LIMIT 1;
    END IF;

    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.slug,
        p.project_url,
        p.featured_image_url,
        COALESCE(pt.description, p.description) as description,
        pt.short_description,
        p.is_featured
    FROM projects p
    LEFT JOIN project_translations pt ON p.id = pt.project_id AND pt.language_id = lang_id
    WHERE p.id != current_project_id
    AND p.is_active = true
    ORDER BY 
        p.is_featured DESC,
        p.sort_order ASC,
        p.created_at DESC
    LIMIT limit_count;
END;
$$;

-- =====================================================
-- VIEW COUNT FUNCTION FOR PROJECT ANALYTICS
-- =====================================================

-- Function to increment project view count (for analytics)
CREATE OR REPLACE FUNCTION increment_project_views(project_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- This could be expanded to track views in a separate analytics table
    -- For now, we'll just update a simple counter (if you add view_count column)
    -- UPDATE projects SET view_count = COALESCE(view_count, 0) + 1 WHERE id = project_id;
    
    -- Placeholder for future analytics implementation
    -- Could insert into project_analytics table for detailed tracking
    NULL;
END;
$$;

-- =====================================================
-- SEARCH FUNCTION FOR PROJECTS
-- =====================================================

-- Function for project search with full-text search
CREATE OR REPLACE FUNCTION search_projects(
    search_query TEXT,
    language_code TEXT DEFAULT 'en',
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    slug VARCHAR(255),
    project_url VARCHAR(255),
    featured_image_url TEXT,
    description TEXT,
    short_description VARCHAR(500),
    is_featured BOOLEAN,
    relevance REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    lang_id UUID;
BEGIN
    -- Get language ID
    SELECT l.id INTO lang_id 
    FROM languages l 
    WHERE l.code = language_code AND l.is_active = true
    LIMIT 1;

    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.slug,
        p.project_url,
        p.featured_image_url,
        COALESCE(pt.description, p.description) as description,
        pt.short_description,
        p.is_featured,
        (
            ts_rank(
                to_tsvector('english', 
                    COALESCE(p.name, '') || ' ' || 
                    COALESCE(p.description, '') || ' ' ||
                    COALESCE(pt.description, '') || ' ' ||
                    COALESCE(pt.short_description, '')
                ),
                plainto_tsquery('english', search_query)
            )
        )::REAL as relevance
    FROM projects p
    LEFT JOIN project_translations pt ON p.id = pt.project_id AND pt.language_id = lang_id
    WHERE p.is_active = true
    AND (
        to_tsvector('english', 
            COALESCE(p.name, '') || ' ' || 
            COALESCE(p.description, '') || ' ' ||
            COALESCE(pt.description, '') || ' ' ||
            COALESCE(pt.short_description, '')
        ) @@ plainto_tsquery('english', search_query)
        OR p.name ILIKE '%' || search_query || '%'
        OR pt.description ILIKE '%' || search_query || '%'
    )
    ORDER BY relevance DESC, p.is_featured DESC, p.sort_order ASC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$;