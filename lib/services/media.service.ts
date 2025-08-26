import { createClient } from '@/lib/supabase/client';

export interface MediaFile {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  alt_text?: string;
  caption?: string;
  uploaded_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UploadResult {
  success: boolean;
  file?: MediaFile;
  error?: string;
}

export class MediaService {
  /**
   * Upload file to Supabase Storage - Client side
   */
  static async uploadFile(
    file: File,
    folder: string = 'blog-media',
    metadata?: {
      alt_text?: string;
      caption?: string;
      uploaded_by?: string;
    }
  ): Promise<UploadResult> {
    const supabase = createClient();
    
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomString}.${extension}`;
      const filePath = `${folder}/${filename}`;

      // Determine bucket based on file type
      let bucketName = 'media';
      if (file.type.startsWith('application/') || file.type === 'text/plain' || file.type === 'text/csv') {
        bucketName = 'documents';
      }

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return {
          success: false,
          error: `Gagal upload file: ${uploadError.message}`
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Get image dimensions if it's an image
      let width: number | undefined;
      let height: number | undefined;
      
      if (file.type.startsWith('image/')) {
        const dimensions = await this.getImageDimensions(file);
        width = dimensions.width;
        height = dimensions.height;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create media file record in database
      const mediaFile: Omit<MediaFile, 'id' | 'created_at' | 'updated_at'> = {
        filename,
        original_filename: file.name,
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        width,
        height,
        alt_text: metadata?.alt_text || '',
        caption: metadata?.caption || '',
        uploaded_by: user?.id,
        is_active: true
      };

      const { data: dbData, error: dbError } = await supabase
        .from('media_files')
        .insert(mediaFile)
        .select()
        .single();

      if (dbError) {
        console.error('Error saving media file to database:', dbError);
        // Try to delete uploaded file if database insert fails
        await supabase.storage.from(bucketName).remove([filePath]);
        
        return {
          success: false,
          error: `Gagal menyimpan data file: ${dbError.message}`
        };
      }

      return {
        success: true,
        file: dbData
      };

    } catch (error) {
      console.error('Error in uploadFile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat upload'
      };
    }
  }

  /**
   * Get image dimensions from File object
   */
  private static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get all media files - Client side
   */
  static async getMediaFiles(
    folder?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<MediaFile[]> {
    const supabase = createClient();
    
    try {
      let query = supabase
        .from('media_files')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (folder) {
        query = query.like('file_path', `${folder}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching media files:', error);
      return [];
    }
  }

  /**
   * Get media file by ID - Client side
   */
  static async getMediaFileById(fileId: string): Promise<MediaFile | null> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .eq('id', fileId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching media file:', error);
      return null;
    }
  }

  /**
   * Update media file metadata - Client side
   */
  static async updateMediaFile(
    fileId: string,
    updates: {
      alt_text?: string;
      caption?: string;
    }
  ): Promise<MediaFile | null> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('media_files')
        .update(updates)
        .eq('id', fileId)
        .eq('is_active', true)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating media file:', error);
      return null;
    }
  }

  /**
   * Delete media file - Client side
   */
  static async deleteMediaFile(fileId: string): Promise<boolean> {
    const supabase = createClient();
    
    try {
      // Get file info first
      const file = await this.getMediaFileById(fileId);
      if (!file) return false;

      // Determine bucket from file path
      const bucketName = file.file_path.includes('/documents/') ? 'documents' : 'media';
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([file.file_path]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        return false;
      }

      // Soft delete from database
      const { error: dbError } = await supabase
        .from('media_files')
        .update({ is_active: false })
        .eq('id', fileId);

      if (dbError) {
        console.error('Error deleting file from database:', dbError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting media file:', error);
      return false;
    }
  }

  /**
   * Search media files - Client side
   */
  static async searchMediaFiles(
    query: string,
    limit: number = 50
  ): Promise<MediaFile[]> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .eq('is_active', true)
        .or(`original_filename.ilike.%${query}%,alt_text.ilike.%${query}%,caption.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching media files:', error);
      return [];
    }
  }

  /**
   * Get media files by folder - Client side
   */
  static async getMediaFilesByFolder(folder: string): Promise<MediaFile[]> {
    return this.getMediaFiles(folder, 1000, 0);
  }

  /**
   * Get media files by type - Client side
   */
  static async getMediaFilesByType(mimeType: string): Promise<MediaFile[]> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .eq('is_active', true)
        .like('mime_type', `${mimeType}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching media files by type:', error);
      return [];
    }
  }
}