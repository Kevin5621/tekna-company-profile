-- Fix Storage RLS policies to use auth.uid() instead of auth.role()
-- This should resolve the "new row violates row-level security policy" error

-- Drop existing policies that use auth.role()
DROP POLICY IF EXISTS "Media bucket authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Media bucket authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Media bucket authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Documents bucket authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Documents bucket authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Documents bucket authenticated deletes" ON storage.objects;

-- Recreate policies using auth.uid() IS NOT NULL
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
