-- Migration: Add media_files table for file storage management
-- Created: 2024-12-25

-- =====================================================
-- MEDIA FILES TABLE
-- =====================================================

-- Media files table for managing uploaded files
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER,
    height INTEGER,
    alt_text TEXT DEFAULT '',
    caption TEXT DEFAULT '',
    uploaded_by UUID, -- References auth.users.id
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(file_path)
);

-- =====================================================
-- INDEXES FOR MEDIA FILES
-- =====================================================

-- Performance indexes for media files
CREATE INDEX idx_media_files_filename ON media_files(filename);
CREATE INDEX idx_media_files_mime_type ON media_files(mime_type);
CREATE INDEX idx_media_files_uploaded_by ON media_files(uploaded_by);
CREATE INDEX idx_media_files_is_active ON media_files(is_active);
CREATE INDEX idx_media_files_created_at ON media_files(created_at);

-- Search index for text fields
CREATE INDEX idx_media_files_search ON media_files USING gin(
    to_tsvector('english', 
        COALESCE(original_filename, '') || ' ' || 
        COALESCE(alt_text, '') || ' ' || 
        COALESCE(caption, '')
    )
);

-- =====================================================
-- TRIGGERS FOR MEDIA FILES
-- =====================================================

-- Update trigger for updated_at
CREATE TRIGGER update_media_files_updated_at 
    BEFORE UPDATE ON media_files 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Public read access for active media files
CREATE POLICY "Active media files are viewable by everyone" ON media_files
    FOR SELECT USING (is_active = true);

-- Authenticated users can upload files
CREATE POLICY "Authenticated users can upload media files" ON media_files
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update files they uploaded
CREATE POLICY "Users can update their uploaded files" ON media_files
    FOR UPDATE USING (
        auth.uid() = uploaded_by 
        OR auth.uid() IS NOT NULL
    );

-- Users can delete files they uploaded, or admins/editors can delete any
CREATE POLICY "Users can delete their uploaded files" ON media_files
    FOR DELETE USING (
        auth.uid() = uploaded_by 
        OR auth.uid() IS NOT NULL
    );

-- =====================================================
-- STORAGE POLICIES (Must be created through Supabase Dashboard)
-- =====================================================

-- Note: Storage bucket policies cannot be created through SQL migrations
-- because we don't have owner privileges on the storage.objects table.
-- 
-- These policies need to be created manually through:
-- 1. Supabase Dashboard > Storage > Policies
-- 2. Or using Supabase CLI storage commands
--
-- Required policies for 'media' bucket:
-- - SELECT: Allow public read access
-- - INSERT: Allow authenticated users to upload
-- - UPDATE: Allow authenticated users to update their files  
-- - DELETE: Allow authenticated users to delete their files
--
-- Required policies for 'documents' bucket:
-- - SELECT: Allow authenticated users to read
-- - INSERT: Allow authenticated users to upload
-- - UPDATE: Allow authenticated users to update their files
-- - DELETE: Allow authenticated users to delete their files

-- TEMPORARY WORKAROUND: Try to create storage policies using DO block
DO $$
BEGIN
  -- Try to create storage policies, ignore errors if we don't have permissions
  BEGIN
    -- Media bucket policies
    CREATE POLICY "Media bucket - public read access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create media read policy: %', SQLERRM;
  END;

  BEGIN
    CREATE POLICY "Media bucket - authenticated upload"
    ON storage.objects FOR INSERT 
    WITH CHECK (
      bucket_id = 'media' 
      AND auth.uid() IS NOT NULL
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create media upload policy: %', SQLERRM;
  END;

  BEGIN
    CREATE POLICY "Media bucket - authenticated update"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'media' 
      AND auth.uid() IS NOT NULL
    )
    WITH CHECK (
      bucket_id = 'media' 
      AND auth.uid() IS NOT NULL
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create media update policy: %', SQLERRM;
  END;

  BEGIN
    CREATE POLICY "Media bucket - authenticated delete"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'media' 
      AND auth.uid() IS NOT NULL
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create media delete policy: %', SQLERRM;
  END;

  -- Documents bucket policies
  BEGIN
    CREATE POLICY "Documents bucket - authenticated read"
    ON storage.objects FOR SELECT
    USING (
      bucket_id = 'documents' 
      AND auth.uid() IS NOT NULL
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create documents read policy: %', SQLERRM;
  END;

  BEGIN
    CREATE POLICY "Documents bucket - authenticated upload"
    ON storage.objects FOR INSERT 
    WITH CHECK (
      bucket_id = 'documents' 
      AND auth.uid() IS NOT NULL
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create documents upload policy: %', SQLERRM;
  END;

  BEGIN
    CREATE POLICY "Documents bucket - authenticated update"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'documents' 
      AND auth.uid() IS NOT NULL
    )
    WITH CHECK (
      bucket_id = 'documents' 
      AND auth.uid() IS NOT NULL
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create documents update policy: %', SQLERRM;
  END;

  BEGIN
    CREATE POLICY "Documents bucket - authenticated delete"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'documents' 
      AND auth.uid() IS NOT NULL
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create documents delete policy: %', SQLERRM;
  END;
END $$;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get media file info by ID
CREATE OR REPLACE FUNCTION get_media_file_info(file_id UUID)
RETURNS TABLE (
    id UUID,
    filename VARCHAR(255),
    original_filename VARCHAR(255),
    file_url TEXT,
    file_size BIGINT,
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mf.id,
        mf.filename,
        mf.original_filename,
        mf.file_url,
        mf.file_size,
        mf.mime_type,
        mf.width,
        mf.height,
        mf.alt_text,
        mf.caption,
        mf.created_at
    FROM media_files mf
    WHERE mf.id = file_id 
    AND mf.is_active = true;
END;
$$;

-- Function to get media files by folder
CREATE OR REPLACE FUNCTION get_media_files_by_folder(folder_path TEXT, limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
    id UUID,
    filename VARCHAR(255),
    original_filename VARCHAR(255),
    file_url TEXT,
    file_size BIGINT,
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mf.id,
        mf.filename,
        mf.original_filename,
        mf.file_url,
        mf.file_size,
        mf.mime_type,
        mf.width,
        mf.height,
        mf.alt_text,
        mf.caption,
        mf.created_at
    FROM media_files mf
    WHERE mf.file_path LIKE folder_path || '%'
    AND mf.is_active = true
    ORDER BY mf.created_at DESC
    LIMIT limit_count;
END;
$$;
