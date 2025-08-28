-- Migration to Fix Remaining Performance Issues
-- Fixes remaining auth_rls_initplan and multiple_permissive_policies issues
-- Date: 2025-08-27

-- =====================================================
-- PART 1: Fix remaining auth_rls_initplan issues
-- =====================================================

-- Fix for public.project_translations table
DROP POLICY IF EXISTS "Admins and editors can manage project translations" ON public.project_translations;
CREATE POLICY "Project translations admin editor manage" ON public.project_translations
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.project_images table
DROP POLICY IF EXISTS "Admins and editors can manage project images" ON public.project_images;
CREATE POLICY "Project images admin editor manage" ON public.project_images
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.categories table
DROP POLICY IF EXISTS "Admins and editors can manage categories" ON public.categories;
CREATE POLICY "Categories admin editor manage" ON public.categories
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.posts table
DROP POLICY IF EXISTS "Admins and editors can manage posts" ON public.posts;
CREATE POLICY "Posts admin editor manage" ON public.posts
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.career_locations table
DROP POLICY IF EXISTS "Career locations admin hr manage" ON public.career_locations;
CREATE POLICY "Career locations admin hr manage" ON public.career_locations
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix for public.career_types table
DROP POLICY IF EXISTS "Career types admin hr manage" ON public.career_types;
CREATE POLICY "Career types admin hr manage" ON public.career_types
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix for public.tags table
DROP POLICY IF EXISTS "Admins and editors can manage tags" ON public.tags;
CREATE POLICY "Tags admin editor manage" ON public.tags
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.post_translations table
DROP POLICY IF EXISTS "Admins and editors can manage post translations" ON public.post_translations;
CREATE POLICY "Post translations admin editor manage" ON public.post_translations
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.post_tags table
DROP POLICY IF EXISTS "Admins and editors can manage post tags" ON public.post_tags;
CREATE POLICY "Post tags admin editor manage" ON public.post_tags
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.career_levels table
DROP POLICY IF EXISTS "Career levels admin hr manage" ON public.career_levels;
CREATE POLICY "Career levels admin hr manage" ON public.career_levels
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix for public.projects table
DROP POLICY IF EXISTS "Admins and editors can manage projects" ON public.projects;
CREATE POLICY "Projects admin editor manage" ON public.projects
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.career_categories table
DROP POLICY IF EXISTS "Career categories admin hr manage" ON public.career_categories;
CREATE POLICY "Career categories admin hr manage" ON public.career_categories
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix for public.career_positions table
DROP POLICY IF EXISTS "Career positions admin hr manage" ON public.career_positions;
CREATE POLICY "Career positions admin hr manage" ON public.career_positions
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix for public.career_skills table
DROP POLICY IF EXISTS "Career skills admin hr manage" ON public.career_skills;
CREATE POLICY "Career skills admin hr manage" ON public.career_skills
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix for public.career_position_skills table
DROP POLICY IF EXISTS "Career position skills admin hr manage" ON public.career_position_skills;
CREATE POLICY "Career position skills admin hr manage" ON public.career_position_skills
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix for public.career_application_activities table
DROP POLICY IF EXISTS "Career application activities admin hr consolidated" ON public.career_application_activities;
CREATE POLICY "Career application activities admin hr consolidated" ON public.career_application_activities
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix for public.career_applications table
DROP POLICY IF EXISTS "Career applications admin hr manage" ON public.career_applications;
CREATE POLICY "Career applications admin hr manage" ON public.career_applications
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix for public.partners table
DROP POLICY IF EXISTS "Partners admin editor manage" ON public.partners;
CREATE POLICY "Partners admin editor manage" ON public.partners
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- =====================================================
-- PART 2: Fix multiple_permissive_policies by consolidating policies
-- =====================================================

-- Fix career_categories table - remove duplicate policies
DROP POLICY IF EXISTS "Career categories consolidated" ON public.career_categories;
DROP POLICY IF EXISTS "Career categories admin hr manage" ON public.career_categories;

-- Create single consolidated policy
CREATE POLICY "Career categories consolidated" ON public.career_categories
    FOR SELECT USING (true);

CREATE POLICY "Career categories admin hr manage" ON public.career_categories
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_locations table - remove duplicate policies
DROP POLICY IF EXISTS "Career locations consolidated" ON public.career_locations;
DROP POLICY IF EXISTS "Career locations admin hr manage" ON public.career_locations;

-- Create single consolidated policy
CREATE POLICY "Career locations consolidated" ON public.career_locations
    FOR SELECT USING (true);

CREATE POLICY "Career locations admin hr manage" ON public.career_locations
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_types table - remove duplicate policies
DROP POLICY IF EXISTS "Career types consolidated" ON public.career_types;
DROP POLICY IF EXISTS "Career types admin hr manage" ON public.career_types;

-- Create single consolidated policy
CREATE POLICY "Career types consolidated" ON public.career_types
    FOR SELECT USING (true);

CREATE POLICY "Career types admin hr manage" ON public.career_types
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_levels table - remove duplicate policies
DROP POLICY IF EXISTS "Career levels consolidated" ON public.career_levels;
DROP POLICY IF EXISTS "Career levels admin hr manage" ON public.career_levels;

-- Create single consolidated policy
CREATE POLICY "Career levels consolidated" ON public.career_levels
    FOR SELECT USING (true);

CREATE POLICY "Career levels admin hr manage" ON public.career_levels
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_positions table - remove duplicate policies
DROP POLICY IF EXISTS "Career positions public read" ON public.career_positions;
DROP POLICY IF EXISTS "Career positions admin hr manage" ON public.career_positions;

-- Create single consolidated policy
CREATE POLICY "Career positions public read" ON public.career_positions
    FOR SELECT USING (is_active = true AND status = 'open');

CREATE POLICY "Career positions admin hr manage" ON public.career_positions
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_skills table - remove duplicate policies
DROP POLICY IF EXISTS "Career skills consolidated" ON public.career_skills;
DROP POLICY IF EXISTS "Career skills admin hr manage" ON public.career_skills;

-- Create single consolidated policy
CREATE POLICY "Career skills consolidated" ON public.career_skills
    FOR SELECT USING (true);

CREATE POLICY "Career skills admin hr manage" ON public.career_skills
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_position_skills table - remove duplicate policies
DROP POLICY IF EXISTS "Career position skills consolidated" ON public.career_position_skills;
DROP POLICY IF EXISTS "Career position skills admin hr manage" ON public.career_position_skills;

-- Create single consolidated policy
CREATE POLICY "Career position skills consolidated" ON public.career_position_skills
    FOR SELECT USING (true);

CREATE POLICY "Career position skills admin hr manage" ON public.career_position_skills
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_applications table - remove duplicate policies
DROP POLICY IF EXISTS "Career applications public insert" ON public.career_applications;
DROP POLICY IF EXISTS "Career applications public read own" ON public.career_applications;
DROP POLICY IF EXISTS "Career applications admin hr manage" ON public.career_applications;

-- Create single consolidated policy
CREATE POLICY "Career applications public insert" ON public.career_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Career applications public read own" ON public.career_applications
    FOR SELECT USING ((select auth.jwt() ->> 'email') = email);

CREATE POLICY "Career applications admin hr manage" ON public.career_applications
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- =====================================================
-- PART 3: Clean up old policies that are no longer needed
-- =====================================================

-- Remove old policies that were causing multiple_permissive_policies issues
-- These policies are now consolidated into the ones above

-- Remove old career system policies that are duplicates
DROP POLICY IF EXISTS "Career categories public read" ON public.career_categories;
DROP POLICY IF EXISTS "Career locations public read" ON public.career_locations;
DROP POLICY IF EXISTS "Career types public read" ON public.career_types;
DROP POLICY IF EXISTS "Career levels public read" ON public.career_levels;
DROP POLICY IF EXISTS "Career positions public read" ON public.career_positions;
DROP POLICY IF EXISTS "Career skills public read" ON public.career_skills;
DROP POLICY IF EXISTS "Career position skills public read" ON public.career_position_skills;

-- Remove old admin policies that are duplicates
DROP POLICY IF EXISTS "Career categories admin hr write" ON public.career_categories;
DROP POLICY IF EXISTS "Career locations admin hr write" ON public.career_locations;
DROP POLICY IF EXISTS "Career types admin hr write" ON public.career_types;
DROP POLICY IF EXISTS "Career levels admin hr write" ON public.career_levels;
DROP POLICY IF EXISTS "Career positions admin hr write" ON public.career_positions;
DROP POLICY IF EXISTS "Career skills admin hr write" ON public.career_skills;
DROP POLICY IF EXISTS "Career position skills admin hr write" ON public.career_position_skills;

-- Remove old career applications policies that are duplicates
DROP POLICY IF EXISTS "Admins and HR can manage career applications" ON public.career_applications;
DROP POLICY IF EXISTS "Admins and HR can view career applications" ON public.career_applications;
DROP POLICY IF EXISTS "Career applications admin hr read all" ON public.career_applications;
DROP POLICY IF EXISTS "Career applications admin manage" ON public.career_applications;
DROP POLICY IF EXISTS "Career applications public read" ON public.career_applications;

-- Remove old career application activities policies that are duplicates
DROP POLICY IF EXISTS "Career application activities admin hr manage" ON public.career_application_activities;
DROP POLICY IF EXISTS "Career application activities admin hr read" ON public.career_application_activities;

-- =====================================================
-- PART 4: Add comments for documentation
-- =====================================================

COMMENT ON TABLE career_categories IS 'Career categories with optimized RLS policies - single SELECT policy for public, single ALL policy for admin/hr';
COMMENT ON TABLE career_locations IS 'Career locations with optimized RLS policies - single SELECT policy for public, single ALL policy for admin/hr';
COMMENT ON TABLE career_types IS 'Career types with optimized RLS policies - single SELECT policy for public, single ALL policy for admin/hr';
COMMENT ON TABLE career_levels IS 'Career levels with optimized RLS policies - single SELECT policy for public, single ALL policy for admin/hr';
COMMENT ON TABLE career_positions IS 'Career positions with optimized RLS policies - single SELECT policy for public, single ALL policy for admin/hr';
COMMENT ON TABLE career_skills IS 'Career skills with optimized RLS policies - single SELECT policy for public, single ALL policy for admin/hr';
COMMENT ON TABLE career_position_skills IS 'Career position skills with optimized RLS policies - single SELECT policy for public, single ALL policy for admin/hr';
COMMENT ON TABLE career_applications IS 'Career applications with optimized RLS policies - single INSERT policy for public, single SELECT policy for own, single ALL policy for admin/hr';
COMMENT ON TABLE career_application_activities IS 'Career application activities with optimized RLS policies - single ALL policy for admin/hr';

-- =====================================================
-- PART 5: Verify function exists
-- =====================================================

-- Ensure get_user_role function exists
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
