'use server';

import { PublicService } from '@/lib/services/public.service';

export async function getPaginatedBlogPosts(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  featured?: boolean;
}) {
  try {
    return await PublicService.getPaginatedPublishedPosts(params);
  } catch (error) {
    console.error('Error fetching paginated blog posts:', error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

export async function searchBlogPosts(query: string) {
  try {
    return await PublicService.searchPosts(query);
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return [];
  }
}

export async function getBlogCategories() {
  try {
    return await PublicService.getActiveCategories();
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}
