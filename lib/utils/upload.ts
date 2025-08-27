import { createClient } from "@/lib/supabase/client";

export interface UploadOptions {
  bucket: string;
  path?: string;
  file: File;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export async function uploadFile(
  options: UploadOptions
): Promise<UploadResult> {
  const {
    bucket,
    path,
    file,
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ],
  } = options;

  try {
    // Validate file size
    if (file.size > maxSize) {
      return {
        success: false,
        error: `File size must be less than ${Math.round(
          maxSize / 1024 / 1024
        )}MB`,
      };
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(
          ", "
        )}`,
      };
    }

    const supabase = createClient();

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop();
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;

    const filePath = path ? `${path}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: "Failed to upload file",
    };
  }
}

export async function deleteFile(
  bucket: string,
  path: string
): Promise<boolean> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage.from(bucket).remove([path]);

    return !error;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
}
