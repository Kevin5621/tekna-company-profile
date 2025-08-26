'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MediaService, type MediaFile } from '@/lib/services/media.service';
import { IconUpload, IconX, IconFile, IconPhoto, IconFileText } from '@tabler/icons-react';

interface MediaUploadProps {
  onUploadSuccess?: (file: MediaFile) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  multiple?: boolean;
  className?: string;
  accept?: string; // Custom accept attribute for input
  placeholder?: string; // Custom placeholder text
  disabled?: boolean; // Disable upload
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export function MediaUpload({
  onUploadSuccess,
  onUploadError,
  folder = 'blog-media',
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  allowedTypes = ['image/*', 'application/pdf', 'text/*'],
  multiple = false,
  className = '',
  accept,
  placeholder,
  disabled = false
}: MediaUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFileTypeAllowed = useCallback((file: File): boolean => {
    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });
  }, [allowedTypes]);

  const isFileSizeAllowed = useCallback((file: File): boolean => {
    return file.size <= maxFileSize;
  }, [maxFileSize]);

  const handleFiles = useCallback(async (files: FileList) => {
    if (disabled) return;
    
    const validFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      if (!isFileTypeAllowed(file)) {
        onUploadError?.(`Tipe file ${file.type} tidak didukung`);
        return;
      }
      
      if (!isFileSizeAllowed(file)) {
        onUploadError?.(`File ${file.name} terlalu besar (maks ${Math.round(maxFileSize / 1024 / 1024)}MB)`);
        return;
      }
      
      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    const newUploadingFiles: UploadingFile[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileIndex = uploadingFiles.length + i;
      
      let progressInterval: NodeJS.Timeout | null = null;
      try {
        progressInterval = setInterval(() => {
          setUploadingFiles(prev => prev.map((f, idx) => 
            idx === fileIndex ? { ...f, progress: Math.min(f.progress + 10, 90) } : f
          ));
        }, 100);

        const result = await MediaService.uploadFile(file, folder, {
          uploaded_by: undefined // Will be set by Supabase auth automatically
        });
        
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        
        if (result.success && result.file) {
          setUploadingFiles(prev => prev.map((f, idx) => 
            idx === fileIndex ? { ...f, progress: 100, status: 'success' } : f
          ));
          
          onUploadSuccess?.(result.file);
          
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter((_, idx) => idx !== fileIndex));
          }, 2000);
        } else {
          setUploadingFiles(prev => prev.map((f, idx) => 
            idx === fileIndex ? { ...f, status: 'error', error: result.error } : f
          ));
          
          onUploadError?.(result.error || 'Upload gagal');
        }
      } catch (error) {
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        setUploadingFiles(prev => prev.map((f, idx) => 
          idx === fileIndex ? { ...f, status: 'error', error: 'Upload gagal' } : f
        ));
        
        onUploadError?.(error instanceof Error ? error.message : 'Upload gagal');
      }
    }
    
    setIsUploading(false);
  }, [folder, onUploadSuccess, onUploadError, uploadingFiles.length, isFileTypeAllowed, isFileSizeAllowed, maxFileSize, disabled]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleUploadAreaClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const removeUploadingFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <IconPhoto className="h-8 w-8 text-primary" />;
    } else if (file.type === 'application/pdf') {
              return <IconFileText className="h-8 w-8 text-destructive" />;
    } else {
      return <IconFile className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className={`border-2 border-dashed transition-colors ${
        dragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-input'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted/50'}`}>
        <CardContent className="p-6">
          <div
            className={`text-center ${disabled ? 'pointer-events-none' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleUploadAreaClick}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={`Upload area - ${placeholder || 'Drag and drop files here or click to select'}`}
            aria-disabled={disabled}
            onKeyDown={(e) => {
              if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <IconUpload 
              className={`h-12 w-12 mx-auto mb-4 ${disabled ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}
              aria-hidden="true"
            />
            <h3 className={`text-lg font-medium mb-2 ${disabled ? 'text-muted-foreground/50' : 'text-foreground'}`}>
              {isUploading ? 'Mengupload...' : 'Upload File'}
            </h3>
            <p className={`mb-4 ${disabled ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
              {placeholder || 'Klik di sini atau drag & drop file untuk upload'}
            </p>
            
            <div className={`text-sm space-y-1 ${disabled ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
              <p>Format yang didukung: {allowedTypes.join(', ')}</p>
              <p>Ukuran maksimal: {Math.round(maxFileSize / 1024 / 1024)}MB</p>
              {multiple && <p>Anda dapat memilih beberapa file sekaligus</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept || allowedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
        aria-label="File input untuk upload"
      />

      {uploadingFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">File yang sedang diupload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploadingFiles.map((uploadingFile, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 border rounded-lg"
                role="status"
                aria-live="polite"
                aria-label={`Upload status for ${uploadingFile.file.name}: ${uploadingFile.status}`}
              >
                {getFileIcon(uploadingFile.file)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate" title={uploadingFile.file.name}>
                      {uploadingFile.file.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUploadingFile(index)}
                      className="h-6 w-6 p-0"
                      aria-label={`Hapus upload ${uploadingFile.file.name}`}
                    >
                      <IconX className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(uploadingFile.file.size)}
                    </p>
                    {uploadingFile.status === 'success' && (
                      <Badge variant="default" className="text-xs" aria-label="Upload berhasil">
                        Selesai
                      </Badge>
                    )}
                    {uploadingFile.status === 'error' && (
                      <Badge variant="destructive" className="text-xs" aria-label="Upload gagal">
                        Error
                      </Badge>
                    )}
                  </div>
                  
                  {uploadingFile.status === 'uploading' && (
                    <div className="w-full bg-muted rounded-full h-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={uploadingFile.progress}>
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadingFile.progress}%` }}
                      />
                      <span className="sr-only">Upload progress: {uploadingFile.progress}%</span>
                    </div>
                  )}
                  
                  {uploadingFile.status === 'error' && uploadingFile.error && (
                    <p className="text-xs text-destructive mt-1" role="alert">
                      {uploadingFile.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}