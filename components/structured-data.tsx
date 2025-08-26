'use client';

import { useEffect } from 'react';

interface BlogPostStructuredDataProps {
  post: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featured_image_url?: string;
    published_at?: string;
    updated_at?: string;
    author_name?: string;
    category?: {
      name: string;
      slug: string;
    };
  };
  siteUrl: string;
}

export function BlogPostStructuredData({ post, siteUrl }: BlogPostStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt || post.title,
      "image": post.featured_image_url ? `${siteUrl}${post.featured_image_url}` : undefined,
      "author": {
        "@type": "Person",
        "name": post.author_name || "PT Sapujagat Nirmana Tekna"
      },
      "publisher": {
        "@type": "Organization",
        "name": "PT Sapujagat Nirmana Tekna",
        "alternateName": "Tekna",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.webp`
        }
      },
      "datePublished": post.published_at,
      "dateModified": post.updated_at || post.published_at,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${siteUrl}/blog/${post.slug}`
      },
      "articleSection": post.category?.name,
      "keywords": post.category?.name,
      "url": `${siteUrl}/blog/${post.slug}`,
      "wordCount": post.content.split(' ').length,
    };

    // Remove undefined values
    Object.keys(structuredData).forEach(key => {
      if (structuredData[key as keyof typeof structuredData] === undefined) {
        delete structuredData[key as keyof typeof structuredData];
      }
    });

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [post, siteUrl]);

  return null;
}

interface OrganizationStructuredDataProps {
  siteUrl: string;
}

export function OrganizationStructuredData({ siteUrl }: OrganizationStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "PT Sapujagat Nirmana Tekna",
      "alternateName": "Tekna",
      "url": siteUrl,
      "logo": `${siteUrl}/logo.webp`,
      "description": "Leading technology solutions provider in Indonesia. We specialize in web development, mobile apps, AI solutions, and digital transformation services.",
      "slogan": "serving the universe",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "ID",
        "addressLocality": "Jakarta",
        "addressRegion": "DKI Jakarta"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "info@tekna.com"
      },
      "sameAs": [
        "https://www.linkedin.com/company/tekna",
        "https://twitter.com/tekna",
        "https://www.facebook.com/tekna"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [siteUrl]);

  return null;
}
