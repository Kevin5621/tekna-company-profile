import { createClient } from "@/lib/supabase/server";
import type { MediaFile } from "./media.service";

export class MediaServiceServer {
  /**
   * Get all media files - Server side
   */
  static async getMediaFiles(
    folder?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<MediaFile[]> {
    const supabase = await createClient();

    try {
      let query = supabase
        .from("media_files")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (folder) {
        query = query.like("file_path", `${folder}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching media files:", error);
      return [];
    }
  }

  /**
   * Get media file by ID - Server side
   */
  static async getMediaFileById(fileId: string): Promise<MediaFile | null> {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("media_files")
        .select("*")
        .eq("id", fileId)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching media file:", error);
      return null;
    }
  }

  /**
   * Upload file from server side (if needed)
   */
  static async uploadFileServer(
    file: File,
    folder: string = "blog-media",
    metadata?: {
      alt_text?: string;
      caption?: string;
      uploaded_by?: string;
    }
  ): Promise<{ success: boolean; file?: MediaFile; error?: string }> {
    const supabase = await createClient();

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split(".").pop();
      const filename = `${timestamp}-${randomString}.${extension}`;
      const filePath = `${folder}/${filename}`;

      // Determine bucket based on file type
      let bucketName = "media";
      if (
        file.type.startsWith("application/") ||
        file.type === "text/plain" ||
        file.type === "text/csv"
      ) {
        bucketName = "documents";
      }

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        return {
          success: false,
          error: `Failed to upload file: ${uploadError.message}`,
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Create media file record in database
      const mediaFile = {
        filename,
        original_filename: file.name,
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        alt_text: metadata?.alt_text || "",
        caption: metadata?.caption || "",
        uploaded_by: metadata?.uploaded_by || undefined,
        is_active: true,
      };

      const { data: dbData, error: dbError } = await supabase
        .from("media_files")
        .insert(mediaFile)
        .select()
        .single();

      if (dbError) {
        console.error("Error saving media file to database:", dbError);
        // Try to delete uploaded file if database insert fails
        await supabase.storage.from(bucketName).remove([filePath]);

        return {
          success: false,
          error: `Failed to save file data: ${dbError.message}`,
        };
      }

      return {
        success: true,
        file: dbData,
      };
    } catch (error) {
      console.error("Error in uploadFileServer:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during upload",
      };
    }
  }

  /**
   * Delete media file - Server side
   */
  static async deleteMediaFile(fileId: string): Promise<boolean> {
    const supabase = await createClient();

    try {
      // Get file info first
      const file = await this.getMediaFileById(fileId);
      if (!file) return false;

      // Determine bucket from file path
      const bucketName = file.file_path.includes("/documents/")
        ? "documents"
        : "media";

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([file.file_path]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        return false;
      }

      // Soft delete from database
      const { error: dbError } = await supabase
        .from("media_files")
        .update({ is_active: false })
        .eq("id", fileId);

      if (dbError) {
        console.error("Error deleting file from database:", dbError);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting media file:", error);
      return false;
    }
  }

  /**
   * Search media files - Server side
   */
  static async searchMediaFiles(
    query: string,
    limit: number = 50
  ): Promise<MediaFile[]> {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("media_files")
        .select("*")
        .eq("is_active", true)
        .or(
          `original_filename.ilike.%${query}%,alt_text.ilike.%${query}%,caption.ilike.%${query}%`
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching media files:", error);
      return [];
    }
  }

  /**
   * Get media files by folder - Server side
   */
  static async getMediaFilesByFolder(folder: string): Promise<MediaFile[]> {
    return this.getMediaFiles(folder, 1000, 0);
  }

  /**
   * Get media files by type - Server side
   */
  static async getMediaFilesByType(mimeType: string): Promise<MediaFile[]> {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("media_files")
        .select("*")
        .eq("is_active", true)
        .like("mime_type", `${mimeType}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching media files by type:", error);
      return [];
    }
  }
}
