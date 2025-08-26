-- Migration: Simplify Role System
-- Description: Simplify to only admin and editor roles
-- Created: 2024-12-20

-- First, create a security-definer function to get the role of a user.
-- This avoids direct recursion in the RLS policy.
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = p_user_id;
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies that might cause issues
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Authenticated users can view user roles" ON user_roles;
DROP POLICY IF EXISTS "Super admins can manage all user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can view user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Super admins can manage all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON user_profiles;

-- Update user_roles table to only have admin and editor
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check CHECK (role IN ('admin', 'editor'));

-- Update existing roles from 'super_admin' to 'admin'
UPDATE user_roles SET role = 'admin' WHERE role = 'super_admin';

-- Create simple, non-recursive policies for user_roles
CREATE POLICY "Users can view their own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can see all roles" ON user_roles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage user roles" ON user_roles
    FOR ALL USING (get_user_role(auth.uid()) = 'admin')
    WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- Create simple policies for user_profiles
CREATE POLICY "Users can view and update their own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user profiles" ON user_profiles
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Drop and recreate all other policies to use the new function-based check
DROP POLICY IF EXISTS "Admins can manage languages" ON languages;
CREATE POLICY "Admins can manage languages" ON languages
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can manage companies" ON companies;
CREATE POLICY "Admins can manage companies" ON companies
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can manage company translations" ON company_translations;
CREATE POLICY "Admins can manage company translations" ON company_translations
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins and editors can manage categories" ON categories
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

DROP POLICY IF EXISTS "Admins can manage tags" ON tags;
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

DROP POLICY IF EXISTS "Admins and editors can manage projects" ON projects;
CREATE POLICY "Admins and editors can manage projects" ON projects
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

DROP POLICY IF EXISTS "Admins and editors can manage project translations" ON project_translations;
CREATE POLICY "Admins and editors can manage project translations" ON project_translations
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

DROP POLICY IF EXISTS "Admins and editors can manage project images" ON project_images;
CREATE POLICY "Admins and editors can manage project images" ON project_images
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

DROP POLICY IF EXISTS "Super admins can view newsletter subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Admins can view newsletter subscriptions" ON newsletter_subscriptions;
CREATE POLICY "Admins can view newsletter subscriptions" ON newsletter_subscriptions
    FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Super admins can manage newsletter subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Admins can manage newsletter subscriptions" ON newsletter_subscriptions;
CREATE POLICY "Admins can manage newsletter subscriptions" ON newsletter_subscriptions
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Add foreign key from user_roles to auth.users
-- This ensures that every role is linked to an existing user.
ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS fk_user_roles_user_id;

ALTER TABLE public.user_roles 
ADD CONSTRAINT fk_user_roles_user_id 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Add foreign key from user_profiles to auth.users
-- This ensures that every profile is linked to an existing user.
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS fk_user_profiles_user_id;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT fk_user_profiles_user_id 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Remove potentially problematic cross-table foreign keys that might also cause issues
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS fk_user_profiles_user_roles_id;

ALTER TABLE public.user_roles
DROP CONSTRAINT IF EXISTS fk_user_roles_user_profiles;