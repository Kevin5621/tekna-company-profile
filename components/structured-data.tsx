"use client";

import { useEffect } from "react";

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

export function BlogPostStructuredData({
  post,
  siteUrl,
}: BlogPostStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || post.title,
      image: post.featured_image_url
        ? `${siteUrl}${post.featured_image_url}`
        : undefined,
      author: {
        "@type": "Person",
        name: post.author_name || "PT Sapujagat Nirmana Tekna",
      },
      publisher: {
        "@type": "Organization",
        name: "PT Sapujagat Nirmana Tekna",
        alternateName: "Tekna",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.webp`,
        },
      },
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${siteUrl}/blog/${post.slug}`,
      },
      articleSection: post.category?.name,
      keywords: post.category?.name,
      url: `${siteUrl}/blog/${post.slug}`,
      wordCount: post.content.split(" ").length,
    };

    // Remove undefined values
    Object.keys(structuredData).forEach((key) => {
      if (structuredData[key as keyof typeof structuredData] === undefined) {
        delete structuredData[key as keyof typeof structuredData];
      }
    });

    const script = document.createElement("script");
    script.type = "application/ld+json";
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

export function OrganizationStructuredData({
  siteUrl,
}: OrganizationStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "PT Sapujagat Nirmana Tekna",
      alternateName: "Tekna",
      url: siteUrl,
      logo: `${siteUrl}/logo.webp`,
      description:
        "PT Sapujagat Nirmana Tekna (Tekna) adalah software house Indonesia terkemuka yang mengkhususkan diri dalam pengembangan IoT, aplikasi mobile, dan website. Solusi teknologi terdepan untuk bisnis Anda.",
      slogan: "serving the universe",
      address: {
        "@type": "PostalAddress",
        addressCountry: "ID",
        addressLocality: "Jakarta",
        addressRegion: "DKI Jakarta",
        postalCode: "12345",
        streetAddress: "Jl. Sudirman No. 123",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+62-21-1234-5678",
        contactType: "customer service",
        email: "info@teknasapujagat.com",
        availableLanguage: ["Indonesian", "English"],
      },
      sameAs: [
        "https://www.linkedin.com/company/tekna-sapujagat",
        "https://www.facebook.com/teknasapujagat",
        "https://www.instagram.com/teknasapujagat",
        "https://twitter.com/teknasapujagat",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Layanan Software Development",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "IoT Development",
              description: "Pengembangan solusi Internet of Things untuk bisnis dan industri",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Mobile App Development",
              description: "Pengembangan aplikasi mobile untuk iOS dan Android",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Web Development",
              description: "Pengembangan website dan aplikasi web modern",
            },
          },
        ],
      },
      areaServed: {
        "@type": "Country",
        name: "Indonesia",
      },
      serviceArea: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: -6.2088,
          longitude: 106.8456,
        },
        geoRadius: "5000",
      },
      foundingDate: "2020",
      numberOfEmployees: "50-100",
      industry: "Software Development",
      keywords: [
        "software house Indonesia",
        "IoT development",
        "mobile app development",
        "web development",
        "PT Sapujagat Nirmana Tekna",
        "Tekna",
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [siteUrl]);

  return null;
}

// New component for Local Business structured data
export function LocalBusinessStructuredData({ siteUrl }: { siteUrl: string }) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "PT Sapujagat Nirmana Tekna",
      alternateName: "Tekna",
      description: "Software house Indonesia terkemuka untuk pengembangan IoT, aplikasi mobile, dan website",
      url: siteUrl,
      telephone: "+62-21-1234-5678",
      email: "info@teknasapujagat.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Sudirman No. 123",
        addressLocality: "Jakarta",
        addressRegion: "DKI Jakarta",
        postalCode: "12345",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -6.2088,
        longitude: 106.8456,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
      priceRange: "$$",
      paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
      currenciesAccepted: "IDR",
      areaServed: "Indonesia",
      hasMap: "https://maps.google.com/?q=-6.2088,106.8456",
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [siteUrl]);

  return null;
}
