-- Storage Setup Script for Tekna Company Profile
-- Run this in Supabase SQL Editor

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create media bucket for blog posts, avatars, etc.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
);

-- Create documents bucket for PDFs, docs, etc.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  104857600, -- 100MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ]
);

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Policy for media bucket - anyone can view, authenticated users can upload
CREATE POLICY "Media bucket public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Media bucket authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Media bucket authenticated updates" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Media bucket authenticated deletes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated'
  );

-- Policy for documents bucket - similar to media
CREATE POLICY "Documents bucket public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Documents bucket authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Documents bucket authenticated updates" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Documents bucket authenticated deletes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' 
    AND auth.role() = 'authenticated'
  );

-- =====================================================
-- STORAGE FUNCTIONS
-- =====================================================

-- Function to get public URL for a file
CREATE OR REPLACE FUNCTION get_storage_url(bucket_name text, file_path text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN 'https://' || current_setting('app.settings.supabase_url') || '/storage/v1/object/public/' || bucket_name || '/' || file_path;
END;
$$;

-- Function to check if user can access file
CREATE OR REPLACE FUNCTION can_access_file(bucket_name text, file_path text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- For now, allow public access to all files
  -- You can add more complex logic here later
  RETURN true;
END;
$$;
