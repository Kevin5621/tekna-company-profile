-- Migration: Update get_project_by_slug function to include additional fields
-- Description: Add technologies, client_name, project_date, etc. to the function
-- Created: 2025-01-28

-- Drop the existing function first
DROP FUNCTION IF EXISTS get_project_by_slug(TEXT, TEXT);

-- Update the get_project_by_slug function to include additional project fields
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
    meta_keywords TEXT,
    technologies TEXT,
    client_name VARCHAR(255),
    project_date VARCHAR(100),
    project_duration VARCHAR(100),
    team_size VARCHAR(100),
    project_status VARCHAR(50)
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
        pt.meta_keywords,
        p.technologies,
        p.client_name,
        p.project_date,
        p.project_duration,
        p.team_size,
        p.project_status
    FROM projects p
    LEFT JOIN project_translations pt ON p.id = pt.project_id AND pt.language_id = lang_id
    WHERE p.slug = project_slug 
    AND p.is_active = true;
END;
$$;
