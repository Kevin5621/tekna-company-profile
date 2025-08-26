import { PublicService } from '@/lib/services/public.service';
import { PublicLayout } from '@/components/layout/public-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { ShareButton } from '@/components/blog/share-button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { IconCalendar, IconEye } from '@tabler/icons-react';
import { ContentRenderer } from '@/components/content-renderer';
import { BlogPostStructuredData } from '@/components/structured-data';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    return await PublicService.getPublishedPostBySlug(slug);
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getRelatedPosts(currentPostId: string, categoryId?: string) {
  try {
    return await PublicService.getRelatedPosts(currentPostId, categoryId, 3);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Article Not Found | Tekna',
      description: 'The requested article could not be found.',
    };
  }

  return {
  title: post.meta_title || `${post.title} | Tekna Blog`,
    description: post.meta_description || post.excerpt || post.title,
    keywords: post.meta_keywords || '',
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || post.title,
      images: post.featured_image_url ? [
        {
          url: post.featured_image_url,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: post.author_name ? [post.author_name] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || post.title,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category_id);

  const getAuthorInitials = (authorName: string) => {
    if (!authorName) return 'AD';
    const names = authorName.trim().split(' ');
    const firstInitial = names[0] ? names[0].charAt(0) : '';
    const lastInitial = names.length > 1 ? names[names.length - 1].charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Increment view count (this would be done client-side in a real app)
  // await PublicService.incrementViewCount(post.id);

  return (
    <PublicLayout>
      <BlogPostStructuredData 
        post={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          featured_image_url: post.featured_image_url,
          published_at: post.published_at,
          updated_at: post.created_at,
          author_name: post.author_name,
          category: post.category ? {
            name: post.category.name,
            slug: post.category.slug
          } : undefined
        }} 
  siteUrl={process.env.NEXT_PUBLIC_SITE_URL || 'https://tekna.com'} 
      />
      <article className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        
        {/* Article Header */}
        <header className="mb-12 lg:mb-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Category Badge */}
            {post.category && (
              <div className="mb-6">
                <Badge 
                  variant="secondary" 
                  className="text-sm px-4 py-1.5 rounded-full text-white border-0 shadow-lg font-medium"
                  style={{ backgroundColor: post.category.color }}
                >
                  {post.category.name}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-8 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Author & Meta Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-border">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {getAuthorInitials(post.author_name || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-semibold text-foreground text-base">
                    {post.author_name || 'Admin'}
                  </p>
                  <p className="text-muted-foreground">
                    Content Writer
                  </p>
                </div>
              </div>

              <Separator orientation="vertical" className="h-8 hidden sm:block" />

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconCalendar className="h-5 w-5" />
                  <time dateTime={post.published_at} className="font-medium">
                    {formatDate(post.published_at)}
                  </time>
                </div>
                
                {post.view_count && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IconEye className="h-5 w-5" />
                    <span className="font-medium">{post.view_count} views</span>
                  </div>
                )}
              </div>

              <Separator orientation="vertical" className="h-8 hidden sm:block" />

              {/* Share Button */}
              <ShareButton 
                url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post.slug}`}
                title={post.title}
                description={post.excerpt || ''}
                variant="outline"
                size="sm"
                className="gap-2 px-4"
              />
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="mb-12 lg:mb-16">
            <div className="max-w-5xl mx-auto">
              <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl border">
                <ImageWithFallback
                  src={post.featured_image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  size="large"
                />
              </div>
            </div>
          </div>
        )}

        {/* Article Content - Single Column Layout */}
        <div className="max-w-4xl mx-auto">
          <ContentRenderer 
            content={post.content || ''}
            contentType="markdown"
            className="prose prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-img:rounded-xl prose-img:shadow-lg prose-pre:bg-muted prose-pre:border prose-pre:rounded-xl prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:rounded-r-lg prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic prose-li:my-2"
          />
        </div>


        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-20 border-t">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Continue Reading</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Discover more articles that might interest you
                </p>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id} 
                    href={`/blog/${relatedPost.slug}`} 
                    className="group block"
                  >
                    <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-2 border-0 shadow-lg">
                      {relatedPost.featured_image_url && (
                        <div className="aspect-[16/10] relative overflow-hidden">
                          <ImageWithFallback
                            src={relatedPost.featured_image_url}
                            alt={relatedPost.title}
                            fill
                            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-3">
                          {relatedPost.title}
                        </h3>
                        {relatedPost.excerpt && (
                          <p className="text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                            {relatedPost.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <IconCalendar className="h-4 w-4" />
                          <time dateTime={relatedPost.published_at || relatedPost.created_at}>
                            {formatDate(relatedPost.published_at || relatedPost.created_at)}
                          </time>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </PublicLayout>
  );
}