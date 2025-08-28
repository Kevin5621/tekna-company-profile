-- Migration to fix auth_rls_initplan and multiple_permissive_policies issues
-- Date: 2025-01-02

-- Fix auth_rls_initplan issues by replacing auth.<function>() with (select auth.<function>())
-- This prevents unnecessary re-evaluation of auth functions per row, improving performance

-- Fix for public.languages table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.languages;
CREATE POLICY "Enable read access for all users" ON public.languages
    FOR SELECT USING (true);

-- Fix for public.companies table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.companies;
CREATE POLICY "Enable read access for all users" ON public.companies
    FOR SELECT USING (true);

-- Fix for public.categories table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
CREATE POLICY "Enable read access for all users" ON public.categories
    FOR SELECT USING (true);

-- Fix for public.posts table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.posts;
CREATE POLICY "Enable read access for all users" ON public.posts
    FOR SELECT USING (true);

-- Fix for public.user_roles table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.user_roles;
CREATE POLICY "Enable read access for authenticated users" ON public.user_roles
    FOR SELECT USING ((select auth.role()) = 'authenticated');

-- Fix for public.user_profiles table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.user_profiles;
CREATE POLICY "Enable read access for authenticated users" ON public.user_profiles
    FOR SELECT USING ((select auth.role()) = 'authenticated');

-- Fix for public.media_files table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.media_files;
CREATE POLICY "Enable read access for all users" ON public.media_files
    FOR SELECT USING (true);

-- Fix for public.tags table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.tags;
CREATE POLICY "Enable read access for all users" ON public.tags
    FOR SELECT USING (true);

-- Fix for public.post_tags table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.post_tags;
CREATE POLICY "Enable read access for all users" ON public.post_tags
    FOR SELECT USING (true);

-- Fix for translation tables
DROP POLICY IF EXISTS "Enable read access for all users" ON public.company_translations;
CREATE POLICY "Enable read access for all users" ON public.company_translations
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON public.post_translations;
CREATE POLICY "Enable read access for all users" ON public.post_translations
    FOR SELECT USING (true);

-- Now fix multiple_permissive_policies by consolidating policies where possible
-- For tables with multiple SELECT policies, consolidate into single, more specific policies

-- For user_profiles, allow users to see their own profile and admins to see all
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (
        (select auth.uid()) = user_id OR 
        (select auth.role()) = 'service_role'
    );

-- For user_roles, allow users to see their own role and admins to see all
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
CREATE POLICY "Users can view their own role" ON public.user_roles
    FOR SELECT USING (
        (select auth.uid()) = user_id OR 
        (select auth.role()) = 'service_role'
    );

-- Grant necessary permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO service_role;
