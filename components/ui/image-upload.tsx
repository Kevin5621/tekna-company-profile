'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { uploadFile } from '@/lib/utils/upload';

interface ImageUploadProps {
  readonly value?: string;
  readonly onChange: (url: string) => void;
  readonly onRemove?: () => void;
  readonly bucket?: string;
  readonly path?: string;
  readonly maxSize?: number;
  readonly allowedTypes?: string[];
  readonly placeholder?: string;
  readonly className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  bucket = 'media',
  path = 'partners',
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
  placeholder = 'Upload an image',
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setUploading(true);

    try {
      const result = await uploadFile({
        bucket,
        path,
        file,
        maxSize,
        allowedTypes
      });

      if (result.success && result.url) {
        onChange(result.url);
      } else {
        alert(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Logo Image</Label>
      
      {value ? (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <div className="relative w-full h-48 bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={value}
                  alt="Uploaded image"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemove}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Click to replace image
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleClick}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Replace Image'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <CardContent className="p-8">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  {uploading ? 'Uploading...' : placeholder}
                </p>
                <p className="text-sm text-gray-500">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-xs text-gray-400">
                  Supported formats: JPG, PNG, WebP, SVG (max {Math.round(maxSize / 1024 / 1024)}MB)
                </p>
              </div>
              {!uploading && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
}
