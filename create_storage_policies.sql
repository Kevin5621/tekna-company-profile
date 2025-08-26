-- =====================================================
-- STORAGE POLICIES - Run this in Supabase SQL Editor
-- =====================================================
-- 
-- Instructions:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Copy and paste this entire script
-- 3. Run the script to create Storage policies
--
-- This script creates the necessary RLS policies for file uploads
-- =====================================================

-- Media bucket policies (public read, authenticated write)
CREATE POLICY "Media bucket - public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Media bucket - authenticated users can upload"
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'media' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Media bucket - authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media' 
  AND auth.uid() IS NOT NULL
)
WITH CHECK (
  bucket_id = 'media' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Media bucket - authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' 
  AND auth.uid() IS NOT NULL
);

-- Documents bucket policies (authenticated read/write)
CREATE POLICY "Documents bucket - authenticated read access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Documents bucket - authenticated users can upload"
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Documents bucket - authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
)
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Documents bucket - authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
);
