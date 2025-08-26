-- Migration: Add HR Role Support
-- Description: Add HR role and update policies for role-based access control
-- Created: 2025-08-26

-- Update user_roles table to include HR role
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check CHECK (role IN ('admin', 'editor', 'hr'));

-- Update the get_user_role function to handle HR role
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = p_user_id AND is_active = true;
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update policies to include HR role where appropriate
-- HR can access career-related features
DROP POLICY IF EXISTS "Admins and editors can manage career categories" ON career_categories;
CREATE POLICY "Admins and HR can manage career categories" ON career_categories
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'hr'));

DROP POLICY IF EXISTS "Admins and editors can manage career levels" ON career_levels;
CREATE POLICY "Admins and HR can manage career levels" ON career_levels
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'hr'));

DROP POLICY IF EXISTS "Admins and editors can manage career types" ON career_types;
CREATE POLICY "Admins and HR can manage career types" ON career_types
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'hr'));

DROP POLICY IF EXISTS "Admins and editors can manage career locations" ON career_locations;
CREATE POLICY "Admins and HR can manage career locations" ON career_locations
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'hr'));

DROP POLICY IF EXISTS "Admins and editors can manage career positions" ON career_positions;
CREATE POLICY "Admins and HR can manage career positions" ON career_positions
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'hr'));

DROP POLICY IF EXISTS "Admins can view career applications" ON career_applications;
CREATE POLICY "Admins and HR can view career applications" ON career_applications
    FOR SELECT USING (get_user_role(auth.uid()) IN ('admin', 'hr'));

DROP POLICY IF EXISTS "Admins can manage career applications" ON career_applications;
CREATE POLICY "Admins and HR can manage career applications" ON career_applications
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'hr'));

-- Update policies to ensure proper role-based access
-- Keep blog access for admins and editors only
DROP POLICY IF EXISTS "Admins and editors can manage categories" ON categories;
CREATE POLICY "Admins and editors can manage categories" ON categories
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

DROP POLICY IF EXISTS "Admins and editors can manage tags" ON tags;
CREATE POLICY "Admins and editors can manage tags" ON tags
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

DROP POLICY IF EXISTS "Admins and editors can manage posts" ON posts;
CREATE POLICY "Admins and editors can manage posts" ON posts
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

DROP POLICY IF EXISTS "Admins and editors can manage post translations" ON post_translations;
CREATE POLICY "Admins and editors can manage post translations" ON post_translations
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

DROP POLICY IF EXISTS "Admins and editors can manage post tags" ON post_tags;
CREATE POLICY "Admins and editors can manage post tags" ON post_tags
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Projects remain admin and editor only
DROP POLICY IF EXISTS "Admins and editors can manage projects" ON projects;
CREATE POLICY "Admins and editors can manage projects" ON projects
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

DROP POLICY IF EXISTS "Admins and editors can manage project translations" ON project_translations;
CREATE POLICY "Admins and editors can manage project translations" ON project_translations
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

DROP POLICY IF EXISTS "Admins and editors can manage project images" ON project_images;
CREATE POLICY "Admins and editors can manage project images" ON project_images
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Settings/profile access for all authenticated users (admin, editor, hr)
-- These are already handled by individual profile policies

-- Admin-only features remain admin-only
-- Newsletter, footer, admin management remain admin-only (no changes needed)
