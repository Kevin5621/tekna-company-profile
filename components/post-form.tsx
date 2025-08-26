'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ClientDashboardService } from '@/lib/services/client-dashboard.service';
import { PostStatus } from '@/lib/types/dashboard';
import { IconEye, IconEyeOff, IconTag, IconUser, IconFileText, IconSettings, IconSeo, IconX, IconUpload, IconPhoto } from '@tabler/icons-react';
import Image from 'next/image';
import { ContentRenderer } from './content-renderer';
import { MarkdownEditor } from './markdown-editor';
import { useToast } from '@/hooks/use-toast'

interface PostFormProps {
  postId?: string;
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image_url: string;
    author_name: string;
    category_id: string;
    status: PostStatus;
    published_at: string;
    is_featured: boolean;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
}

export function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [activeTab, setActiveTab] = useState('content');
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Markdown-only approach - no content type needed
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    featured_image_url: initialData?.featured_image_url || '',
    author_name: initialData?.author_name || '',
    category_id: initialData?.category_id || '',
    status: initialData?.status || 'draft' as PostStatus,
    published_at: initialData?.published_at || undefined,
    is_featured: initialData?.is_featured || false,
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    meta_keywords: initialData?.meta_keywords || '',
  });

  const { toast } = useToast()

  // Load categories and authors
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories
        const categoriesData = await ClientDashboardService.getCategories();
        setCategories(categoriesData);
        
        // Load authors
        const authorsData = await ClientDashboardService.getAuthors();
        setAuthors(authorsData);
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    };

    loadData();
  }, []);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title && !postId) {
      const autoSlug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.title, postId]);

  // Auto-generate meta title and description
  useEffect(() => {
    if (formData.title && !formData.meta_title) {
      setFormData(prev => ({ ...prev, meta_title: formData.title }));
    }
    if (formData.excerpt && !formData.meta_description) {
      setFormData(prev => ({ ...prev, meta_description: formData.excerpt }));
    }
  }, [formData.title, formData.excerpt, formData.meta_title, formData.meta_description]);


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Judul artikel wajib diisi';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug wajib diisi';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Konten artikel wajib diisi';
    }
    
    if (formData.status === 'published' && !formData.published_at) {
      newErrors.published_at = 'Tanggal publikasi wajib diisi untuk artikel yang dipublish';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        published_at: formData.status === 'published' && !formData.published_at 
          ? new Date().toISOString() 
          : formData.published_at || undefined
      };

      if (postId) {
        await ClientDashboardService.updatePost(postId, dataToSubmit);
        toast({
          title: "Post Updated!",
          description: "Post has been updated successfully.",
          variant: "success",
        })
      } else {
        await ClientDashboardService.createPost(dataToSubmit);
        toast({
          title: "Post Created!",
          description: "Post has been created successfully.",
          variant: "success",
        })
      }
      
      router.push('/dashboard/blog');
      router.refresh();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getCharacterCount = (text: string, max: number) => {
    const count = text.length;
    const percentage = (count / max) * 100;
    let color = 'text-green-600';
    if (percentage > 80) color = 'text-yellow-600';
    if (percentage > 100) color = 'text-red-600';
    
    return (
      <span className={`text-xs ${color}`}>
        {count}/{max} karakter
      </span>
    );
  };

  const getSelectedAuthor = () => {
    if (formData.author_name === 'none') return null;
    return authors.find(author => author.id === formData.author_name);
  };

  const getSelectedCategory = () => {
    if (formData.category_id === 'none') return null;
    return categories.find(category => category.id === formData.category_id);
  };

  // Image upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Hanya file gambar yang diperbolehkan",
        variant: "destructive",
      })
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Ukuran file maksimal 5MB",
        variant: "destructive",
      })
      return;
    }

    setIsUploading(true);
    try {
      // For now, we'll use a placeholder URL
      // In production, you'd upload to your storage service
      const placeholderUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, featured_image_url: placeholderUrl }));
      toast({
        title: "Image Uploaded!",
        description: "Post image has been uploaded successfully.",
        variant: "success",
      })
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "Gagal upload file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, featured_image_url: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {postId ? 'Edit Artikel' : 'Tambah Artikel Baru'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {postId ? 'Edit artikel yang sudah ada' : 'Buat artikel baru untuk blog'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            {showPreview ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            {showPreview ? 'Sembunyikan Preview' : 'Preview'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <IconX size={16} />
            Batal
          </Button>
        </div>
      </div>
{/* Preview, Stats & Help Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Article Preview */}
          {showPreview && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconEye size={20} />
                  Preview Artikel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.featured_image_url && (
                  <Image 
                    src={formData.featured_image_url} 
                    alt="Featured" 
                    width={400}
                    height={128}
                    className="w-full h-32 object-cover rounded"
                  />
                )}
                
                <div>
                  <h2 className="text-lg font-semibold line-clamp-2">
                    {formData.title || 'Judul Artikel'}
                  </h2>
                  {formData.excerpt && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      {formData.excerpt}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {getSelectedAuthor() && (
                    <span className="flex items-center gap-1">
                      <IconUser size={14} />
                      {getSelectedAuthor()?.first_name} {getSelectedAuthor()?.last_name}
                    </span>
                  )}
                  {getSelectedCategory() && (
                    <span className="flex items-center gap-1">
                      <IconTag size={14} />
                      {getSelectedCategory()?.name}
                    </span>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Konten Preview</h4>
                  <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                    <ContentRenderer 
                      content={formData.content || 'Konten akan ditampilkan di sini...'}
                      contentType="markdown"
                      className="text-xs"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">SEO Preview</h4>
                  <div className="text-xs space-y-1">
                    <p className="font-medium">
                      {formData.meta_title || formData.title || 'Title'}
                    </p>
                    <p className="text-muted-foreground line-clamp-2">
                      {formData.meta_description || formData.excerpt || 'Description'}
                    </p>
                    <p className="text-blue-600">
                      /blog/{formData.slug || 'slug'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistik Artikel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Judul</span>
                <Badge variant={formData.title.length > 0 ? 'default' : 'secondary'}>
                  {formData.title.length} karakter
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Konten</span>
                <Badge variant={formData.content.length > 100 ? 'default' : 'secondary'}>
                  {formData.content.length} karakter
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Format</span>
                <Badge variant="outline">
                  MARKDOWN
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={
                  formData.status === 'published' ? 'default' : 
                  formData.status === 'draft' ? 'secondary' : 'outline'
                }>
                  {formData.status}
                </Badge>
              </div>

              {formData.is_featured && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Featured</span>
                  <Badge variant="default">✓</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help & Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips & Bantuan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p className="font-medium text-foreground">Markdown Editor</p>
                <p>Gunakan toolbar atau keyboard shortcuts untuk formatting. Ctrl+B untuk bold, Ctrl+I untuk italic.</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="font-medium text-foreground">Gambar</p>
                <p>Drag & drop gambar atau gunakan URL. Format yang didukung: PNG, JPG, GIF.</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="font-medium text-foreground">SEO</p>
                <p>Isi meta title dan description untuk optimasi search engine.</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
      {/* Main Content */}
      <div className="space-y-8">
        {/* Form Section */}
        <Card>
      <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText size={20} />
              Form Artikel
        </CardTitle>
      </CardHeader>
      <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <IconFileText size={16} />
                    Konten
                  </TabsTrigger>
                  <TabsTrigger value="metadata" className="flex items-center gap-2">
                    <IconFileText size={16} />
                    Metadata
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="flex items-center gap-2">
                    <IconSeo size={16} />
                    SEO
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <IconSettings size={16} />
                    Pengaturan
                  </TabsTrigger>
            </TabsList>

            {/* Content Tab */}
                <TabsContent value="content" className="space-y-6 mt-6">
              {/* Title */}
              <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Judul Artikel *
                    </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Masukkan judul artikel yang menarik"
                      className={errors.title ? 'border-red-500' : ''}
                  required
                />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title}</p>
                    )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                    <Label htmlFor="slug" className="text-sm font-medium">
                      Slug *
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">/blog/</span>
                <Input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="url-friendly-slug"
                        className={errors.slug ? 'border-red-500' : ''}
                  required
                />
                    </div>
                    {errors.slug && (
                      <p className="text-sm text-red-500">{errors.slug}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      URL artikel akan menjadi: /blog/{formData.slug}
                </p>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-sm font-medium">
                      Ringkasan
                    </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      placeholder="Ringkasan singkat artikel untuk preview dan SEO"
                  rows={3}
                />
                    {getCharacterCount(formData.excerpt, 160)}
              </div>

              {/* Content */}
              <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-medium">
                      Konten Artikel *
                    </Label>
                    <MarkdownEditor
                  value={formData.content}
                      onChange={(value) => handleInputChange('content', value)}
                      placeholder="# Judul Artikel\n\nParagraf pertama...\n\n## Sub Judul\n\n- Item 1\n- Item 2\n\n**Teks tebal** dan *teks miring*"
                    />
                    {errors.content && (
                      <p className="text-sm text-red-500">{errors.content}</p>
                    )}
              </div>
            </TabsContent>

            {/* Metadata Tab */}
                <TabsContent value="metadata" className="space-y-6 mt-6">
                  {/* Featured Image Upload */}
              <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Gambar Utama
                    </Label>
                    
                    {/* Image Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {formData.featured_image_url ? (
                        <div className="space-y-4">
                          <Image
                            src={formData.featured_image_url}
                            alt="Featured"
                            width={400}
                            height={192}
                            className="w-full max-w-md h-48 object-cover rounded mx-auto"
                          />
                          <div className="flex gap-2 justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploading}
                              className="gap-2"
                            >
                              <IconUpload size={16} />
                              Ganti Gambar
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={removeImage}
                              className="gap-2 text-red-600 hover:text-red-700"
                            >
                              <IconX size={16} />
                              Hapus
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
                            <IconPhoto size={32} className="text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Drag & drop gambar atau klik untuk upload
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG, GIF hingga 5MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="gap-2"
                          >
                            <IconUpload size={16} />
                            {isUploading ? 'Uploading...' : 'Pilih File'}
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {/* URL Input Fallback */}
                    <div className="mt-4">
                      <Label htmlFor="featured_image_url" className="text-sm font-medium">
                        Atau masukkan URL gambar
                      </Label>
                <Input
                  id="featured_image_url"
                  type="url"
                  value={formData.featured_image_url}
                  onChange={(e) => handleInputChange('featured_image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                    </div>
              </div>

              {/* Author Selection */}
              <div className="space-y-2">
                    <Label htmlFor="author_name" className="text-sm font-medium">
                      Penulis
                    </Label>
                {authors.length > 0 ? (
                  <Select
                    value={formData.author_name}
                    onValueChange={(value) => handleInputChange('author_name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih penulis" />
                    </SelectTrigger>
                    <SelectContent>
                          <SelectItem value="none">Tidak ada penulis</SelectItem>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                              <div className="flex items-center gap-2">
                                <IconUser size={16} />
                          {author.first_name} {author.last_name} - {author.position}
                              </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="author_name"
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => handleInputChange('author_name', e.target.value)}
                    placeholder="Nama penulis"
                  />
                )}
                    
                    {getSelectedAuthor() && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <IconUser size={12} />
                        <span>{getSelectedAuthor()?.first_name} {getSelectedAuthor()?.last_name}</span>
                        <span>•</span>
                        <span>{getSelectedAuthor()?.position}</span>
                      </div>
                    )}
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                    <Label htmlFor="category_id" className="text-sm font-medium">
                      Kategori
                    </Label>
                {categories.length > 0 ? (
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange('category_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                          <SelectItem value="none">Tidak ada kategori</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <IconTag size={16} />
                          {category.name}
                              </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="category_id"
                    type="text"
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    placeholder="UUID kategori (opsional)"
                  />
                )}
                    
                    {getSelectedCategory() && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <IconTag size={12} />
                        <span>{getSelectedCategory()?.name}</span>
                      </div>
                    )}
              </div>
            </TabsContent>

            {/* SEO Tab */}
                <TabsContent value="seo" className="space-y-6 mt-6">
              {/* Meta Title */}
              <div className="space-y-2">
                    <Label htmlFor="meta_title" className="text-sm font-medium">
                      Meta Title
                    </Label>
                <Input
                  id="meta_title"
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  placeholder="Title untuk SEO (default: judul artikel)"
                />
                    {getCharacterCount(formData.meta_title, 60)}
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                    <Label htmlFor="meta_description" className="text-sm font-medium">
                      Meta Description
                    </Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  placeholder="Deskripsi untuk SEO (default: excerpt artikel)"
                  rows={3}
                />
                    {getCharacterCount(formData.meta_description, 160)}
              </div>

              {/* Meta Keywords */}
              <div className="space-y-2">
                    <Label htmlFor="meta_keywords" className="text-sm font-medium">
                      Meta Keywords
                    </Label>
                <Input
                  id="meta_keywords"
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                  placeholder="Kata kunci dipisahkan dengan koma"
                />
                    <p className="text-xs text-muted-foreground">
                  Contoh: web development, teknologi, inovasi
                </p>
              </div>
            </TabsContent>

            {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6 mt-6">
              {/* Status */}
              <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium">
                      Status *
                    </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: PostStatus) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status artikel" />
                  </SelectTrigger>
                  <SelectContent>
                        <SelectItem value="draft">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            Draft
                          </div>
                        </SelectItem>
                        <SelectItem value="published">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Published
                          </div>
                        </SelectItem>
                        <SelectItem value="archived">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            Archived
                          </div>
                        </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Published At */}
              <div className="space-y-2">
                    <Label htmlFor="published_at" className="text-sm font-medium">
                      Tanggal Publikasi
                    </Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleInputChange('published_at', e.target.value ? new Date(e.target.value).toISOString() : '')}
                      className={errors.published_at ? 'border-red-500' : ''}
                />
                    {errors.published_at && (
                      <p className="text-sm text-red-500">{errors.published_at}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                  Kosongkan untuk publikasi otomatis saat status diubah ke Published
                </p>
              </div>

              {/* Is Featured */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleInputChange('is_featured', !!checked)}
                />
                    <Label htmlFor="is_featured" className="text-sm font-medium">
                      Artikel Unggulan
                    </Label>
              </div>
            </TabsContent>
          </Tabs>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
                  type="submit"
              disabled={isLoading}
                  className="gap-2"
            >
              {isLoading 
                ? (postId ? 'Menyimpan...' : 'Membuat...') 
                : (postId ? 'Simpan Perubahan' : 'Buat Artikel')
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
      </div>
    </div>
  );
}
