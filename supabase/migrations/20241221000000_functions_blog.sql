-- Migration: Add missing functions and fix issues
-- Description: Add increment_post_views function and other missing functionality
-- Created: 2024-12-21

-- Create function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE posts 
    SET view_count = COALESCE(view_count, 0) + 1,
        updated_at = NOW()
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure view_count has a default value
ALTER TABLE posts ALTER COLUMN view_count SET DEFAULT 0;

-- Update any NULL view_count values to 0
UPDATE posts SET view_count = 0 WHERE view_count IS NULL;

-- Create function to search posts with better performance
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
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get related posts
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
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add some indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_title_search ON posts USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_posts_excerpt_search ON posts USING GIN (to_tsvector('english', COALESCE(excerpt, '')));
CREATE INDEX IF NOT EXISTS idx_posts_category_published ON posts(category_id, published_at) WHERE status = 'published' AND is_active = true;

-- Create a view for published posts with categories for easier querying
CREATE OR REPLACE VIEW published_posts_with_categories AS
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant SELECT permissions on the view to public users
GRANT SELECT ON published_posts_with_categories TO anon;
GRANT SELECT ON published_posts_with_categories TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION increment_post_views(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_post_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION search_published_posts(TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION search_published_posts(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_related_posts(UUID, UUID, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_related_posts(UUID, UUID, INTEGER) TO authenticated;
