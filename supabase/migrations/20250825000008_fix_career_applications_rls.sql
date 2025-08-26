-- Fix RLS policy for career_applications table
-- Created: 2025-08-25

-- Drop existing policies for career_applications
DROP POLICY IF EXISTS "Career applications public insert" ON career_applications;
DROP POLICY IF EXISTS "Career applications public read" ON career_applications;
DROP POLICY IF EXISTS "Career applications admin manage" ON career_applications;

-- Create new policies that allow public access
-- Allow anyone to insert applications (for job applications)
CREATE POLICY "Career applications public insert" ON career_applications 
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read applications (for viewing their own applications)
CREATE POLICY "Career applications public read" ON career_applications 
  FOR SELECT USING (true);

-- Allow admins to manage all applications
CREATE POLICY "Career applications admin manage" ON career_applications 
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  );

-- Also ensure the table has RLS enabled
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
