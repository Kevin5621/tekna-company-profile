-- Setup Storage Buckets and Policies
-- Description: Create media and documents buckets with proper RLS policies
-- Created: 2025-08-26

-- Create media bucket for images, logos, etc.
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
    'image/svg+xml'
  ]
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Media Bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Media bucket public access" ON storage.objects;
DROP POLICY IF EXISTS "Media bucket authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Media bucket authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Media bucket authenticated deletes" ON storage.objects;

-- Public read access for media
CREATE POLICY "Media bucket public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Authenticated users can upload, update, delete
CREATE POLICY "Media bucket authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Media bucket authenticated updates" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'media' 
    AND auth.uid() IS NOT NULL
  )
  WITH CHECK (
    bucket_id = 'media' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Media bucket authenticated deletes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media' 
    AND auth.uid() IS NOT NULL
  );

-- Storage Policies for Documents Bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Documents bucket public access" ON storage.objects;
DROP POLICY IF EXISTS "Documents bucket authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Documents bucket authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Documents bucket authenticated deletes" ON storage.objects;

-- Public read access for documents
CREATE POLICY "Documents bucket public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

-- Authenticated users can upload, update, delete
CREATE POLICY "Documents bucket authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Documents bucket authenticated updates" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' 
    AND auth.uid() IS NOT NULL
  )
  WITH CHECK (
    bucket_id = 'documents' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Documents bucket authenticated deletes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' 
    AND auth.uid() IS NOT NULL
  );
