-- Comprehensive Migration to Fix Performance Issues
-- Fixes auth_rls_initplan and multiple_permissive_policies issues
-- Date: 2025-01-02

-- =====================================================
-- PART 1: Fix auth_rls_initplan issues
-- Replace auth.<function>() with (select auth.<function>())
-- =====================================================

-- Fix for public.languages table
DROP POLICY IF EXISTS "Admins can manage languages" ON public.languages;
CREATE POLICY "Admins can manage languages" ON public.languages
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.companies table
DROP POLICY IF EXISTS "Admins can manage companies" ON public.companies;
CREATE POLICY "Admins can manage companies" ON public.companies
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.company_translations table
DROP POLICY IF EXISTS "Admins can manage company translations" ON public.company_translations;
CREATE POLICY "Admins can manage company translations" ON public.company_translations
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.categories table
DROP POLICY IF EXISTS "Admins and editors can manage categories" ON public.categories;
CREATE POLICY "Admins and editors can manage categories" ON public.categories
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.tags table
DROP POLICY IF EXISTS "Admins and editors can manage tags" ON public.tags;
CREATE POLICY "Admins and editors can manage tags" ON public.tags
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.posts table
DROP POLICY IF EXISTS "Admins and editors can manage posts" ON public.posts;
CREATE POLICY "Admins and editors can manage posts" ON public.posts
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.post_translations table
DROP POLICY IF EXISTS "Admins and editors can manage post translations" ON public.post_translations;
CREATE POLICY "Admins and editors can manage post translations" ON public.post_translations
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.post_tags table
DROP POLICY IF EXISTS "Admins and editors can manage post tags" ON public.post_tags;
CREATE POLICY "Admins and editors can manage post tags" ON public.post_tags
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.projects table
DROP POLICY IF EXISTS "Admins and editors can manage projects" ON public.projects;
CREATE POLICY "Admins and editors can manage projects" ON public.projects
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.project_translations table
DROP POLICY IF EXISTS "Admins and editors can manage project translations" ON public.project_translations;
CREATE POLICY "Admins and editors can manage project translations" ON public.project_translations
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.project_images table
DROP POLICY IF EXISTS "Admins and editors can manage project images" ON public.project_images;
CREATE POLICY "Admins and editors can manage project images" ON public.project_images
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.newsletter_subscriptions table
DROP POLICY IF EXISTS "Admins can manage newsletter subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Admins can manage newsletter subscriptions" ON public.newsletter_subscriptions
    FOR ALL USING ((select auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Admins can view newsletter subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Admins can view newsletter subscriptions" ON public.newsletter_subscriptions
    FOR SELECT USING ((select auth.role()) = 'service_role');

-- Fix for public.user_roles table
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" ON public.user_roles
    FOR ALL USING ((select auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Authenticated users can see all roles" ON public.user_roles;
CREATE POLICY "Authenticated users can see all roles" ON public.user_roles
    FOR SELECT USING ((select auth.role()) = 'authenticated');

-- Fix for public.user_profiles table
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON public.user_profiles;
CREATE POLICY "Admins can manage all user profiles" ON public.user_profiles
    FOR ALL USING ((select auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Users can view and update their own profile" ON public.user_profiles;
CREATE POLICY "Users can view and update their own profile" ON public.user_profiles
    FOR ALL USING ((select auth.uid()) = user_id);

-- Fix for public.media_files table
DROP POLICY IF EXISTS "Authenticated users can upload media files" ON public.media_files;
CREATE POLICY "Authenticated users can upload media files" ON public.media_files
    FOR INSERT WITH CHECK ((select auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "Users can delete their uploaded files" ON public.media_files;
CREATE POLICY "Users can delete their uploaded files" ON public.media_files
    FOR DELETE USING ((select auth.uid()) = uploaded_by);

DROP POLICY IF EXISTS "Users can update their uploaded files" ON public.media_files;
CREATE POLICY "Users can update their uploaded files" ON public.media_files
    FOR UPDATE USING ((select auth.uid()) = uploaded_by);

-- Fix for public.footer_sections table
DROP POLICY IF EXISTS "Admins can manage footer sections" ON public.footer_sections;
CREATE POLICY "Admins can manage footer sections" ON public.footer_sections
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.footer_links table
DROP POLICY IF EXISTS "Admins can manage footer links" ON public.footer_links;
CREATE POLICY "Admins can manage footer links" ON public.footer_links
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.social_media table
DROP POLICY IF EXISTS "Admins can manage social media" ON public.social_media;
CREATE POLICY "Admins can manage social media" ON public.social_media
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.contact_info table
DROP POLICY IF EXISTS "Admins can manage contact info" ON public.contact_info;
CREATE POLICY "Admins can manage contact info" ON public.contact_info
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.newsletter_settings table
DROP POLICY IF EXISTS "Admins can manage newsletter settings" ON public.newsletter_settings;
CREATE POLICY "Admins can manage newsletter settings" ON public.newsletter_settings
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for translation tables
DROP POLICY IF EXISTS "Admins can manage footer section translations" ON public.footer_section_translations;
CREATE POLICY "Admins can manage footer section translations" ON public.footer_section_translations
    FOR ALL USING ((select auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Admins can manage footer link translations" ON public.footer_link_translations;
CREATE POLICY "Admins can manage footer link translations" ON public.footer_link_translations
    FOR ALL USING ((select auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Admins can manage contact info translations" ON public.contact_info_translations;
CREATE POLICY "Admins can manage contact info translations" ON public.contact_info_translations
    FOR ALL USING ((select auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Admins can manage newsletter settings translations" ON public.newsletter_settings_translations;
CREATE POLICY "Admins can manage newsletter settings translations" ON public.newsletter_settings_translations
    FOR ALL USING ((select auth.role()) = 'service_role');

-- =====================================================
-- PART 2: Fix multiple_permissive_policies issues
-- Consolidate overlapping policies for better performance
-- =====================================================

-- Fix career_categories table - consolidate multiple policies
DROP POLICY IF EXISTS "Admins and HR can manage career categories" ON public.career_categories;
DROP POLICY IF EXISTS "Career categories admin hr write" ON public.career_categories;
DROP POLICY IF EXISTS "Career categories public read" ON public.career_categories;

-- Create consolidated policies
CREATE POLICY "Career categories consolidated" ON public.career_categories
    FOR SELECT USING (true);

CREATE POLICY "Career categories admin hr manage" ON public.career_categories
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_locations table - consolidate multiple policies
DROP POLICY IF EXISTS "Admins and HR can manage career locations" ON public.career_locations;
DROP POLICY IF EXISTS "Career locations admin hr write" ON public.career_locations;
DROP POLICY IF EXISTS "Career locations public read" ON public.career_locations;

-- Create consolidated policies
CREATE POLICY "Career locations consolidated" ON public.career_locations
    FOR SELECT USING (true);

CREATE POLICY "Career locations admin hr manage" ON public.career_locations
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_types table - consolidate multiple policies
DROP POLICY IF EXISTS "Admins and HR can manage career types" ON public.career_types;
DROP POLICY IF EXISTS "Career types admin hr write" ON public.career_types;
DROP POLICY IF EXISTS "Career types public read" ON public.career_types;

-- Create consolidated policies
CREATE POLICY "Career types consolidated" ON public.career_types
    FOR SELECT USING (true);

CREATE POLICY "Career types admin hr manage" ON public.career_types
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_levels table - consolidate multiple policies
DROP POLICY IF EXISTS "Admins and HR can manage career levels" ON public.career_levels;
DROP POLICY IF EXISTS "Career levels admin hr write" ON public.career_levels;
DROP POLICY IF EXISTS "Career levels public read" ON public.career_levels;

-- Create consolidated policies
CREATE POLICY "Career levels consolidated" ON public.career_levels
    FOR SELECT USING (true);

CREATE POLICY "Career levels admin hr manage" ON public.career_levels
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_positions table - consolidate multiple policies
DROP POLICY IF EXISTS "Admins and HR can manage career positions" ON public.career_positions;
DROP POLICY IF EXISTS "Career positions admin hr write" ON public.career_positions;
DROP POLICY IF EXISTS "Career positions admin read all" ON public.career_positions;
DROP POLICY IF EXISTS "Career positions public read" ON public.career_positions;

-- Create consolidated policies
CREATE POLICY "Career positions public read" ON public.career_positions
    FOR SELECT USING (is_active = true AND status = 'open');

CREATE POLICY "Career positions admin hr manage" ON public.career_positions
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_skills table - consolidate multiple policies
DROP POLICY IF EXISTS "Career skills admin hr write" ON public.career_skills;
DROP POLICY IF EXISTS "Career skills public read" ON public.career_skills;

-- Create consolidated policies
CREATE POLICY "Career skills consolidated" ON public.career_skills
    FOR SELECT USING (true);

CREATE POLICY "Career skills admin hr manage" ON public.career_skills
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_position_skills table - consolidate multiple policies
DROP POLICY IF EXISTS "Career position skills admin hr write" ON public.career_position_skills;
DROP POLICY IF EXISTS "Career position skills public read" ON public.career_position_skills;

-- Create consolidated policies
CREATE POLICY "Career position skills consolidated" ON public.career_position_skills
    FOR SELECT USING (true);

CREATE POLICY "Career position skills admin hr manage" ON public.career_position_skills
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_applications table - consolidate multiple policies
DROP POLICY IF EXISTS "Admins and HR can manage career applications" ON public.career_applications;
DROP POLICY IF EXISTS "Admins and HR can view career applications" ON public.career_applications;
DROP POLICY IF EXISTS "Career applications admin hr manage" ON public.career_applications;
DROP POLICY IF EXISTS "Career applications admin hr read all" ON public.career_applications;
DROP POLICY IF EXISTS "Career applications admin manage" ON public.career_applications;
DROP POLICY IF EXISTS "Career applications public insert" ON public.career_applications;
DROP POLICY IF EXISTS "Career applications public read" ON public.career_applications;

-- Create consolidated policies
CREATE POLICY "Career applications public insert" ON public.career_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Career applications public read own" ON public.career_applications
    FOR SELECT USING ((select auth.jwt() ->> 'email') = email);

CREATE POLICY "Career applications admin hr manage" ON public.career_applications
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix career_application_activities table - consolidate multiple policies
DROP POLICY IF EXISTS "Career application activities admin hr manage" ON public.career_application_activities;
DROP POLICY IF EXISTS "Career application activities admin hr read" ON public.career_application_activities;

-- Create consolidated policies
CREATE POLICY "Career application activities admin hr consolidated" ON public.career_application_activities
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Fix partners table
DROP POLICY IF EXISTS "Admins and editors can manage partners" ON public.partners;
CREATE POLICY "Partners admin editor manage" ON public.partners
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- =====================================================
-- PART 3: Add missing function if it doesn't exist
-- =====================================================

-- Create get_user_role function if it doesn't exist
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

-- =====================================================
-- PART 4: Grant necessary permissions
-- =====================================================

-- Grant permissions for public read access
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant permissions for service role (admin operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- =====================================================
-- PART 5: Create indexes for better performance
-- =====================================================

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_career_positions_status_active ON career_positions(status, is_active);
CREATE INDEX IF NOT EXISTS idx_career_applications_email ON career_applications(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_active ON user_roles(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);

-- =====================================================
-- PART 6: Add comments for documentation
-- =====================================================

COMMENT ON FUNCTION get_user_role(UUID) IS 'Get user role for RLS policies with proper performance optimization';
COMMENT ON TABLE career_positions IS 'Career positions with optimized RLS policies for better performance';
COMMENT ON TABLE career_applications IS 'Career applications with consolidated RLS policies';
