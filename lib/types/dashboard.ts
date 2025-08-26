// Types for dashboard data based on Supabase schema
import { ComponentType } from 'react';

export type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'on-hold';
export type PostStatus = 'draft' | 'published' | 'archived';

export interface DashboardStats {
  title: string;
  value: string;
  description: string;
  icon?: ComponentType<{ className?: string }>; // Icon component (optional, will be added in dashboard page)
  change: string;
  changeType: 'positive' | 'negative' | 'default';
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  description?: string;
}

export interface Post {
  id: string;
  title: string;
  author: string;
  status: PostStatus;
  views: number;
  publishedAt: string | null;
}

export interface DashboardData {
  stats: DashboardStats[];
  recentProjects: Project[];
  recentPosts: Post[];
  servicesCount: number;
}

export interface SupabaseProject {
  id: string;
  name: string;
  status: string;
  project_translations: Array<{
    short_description: string | null;
  }>;
}

export interface SupabasePost {
  id: string;
  title: string;
  status: string;
  view_count: number | null;
  published_at: string | null;
  author_name: string | null;
}

export interface SupabaseTeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  department: string | null;
  avatar_url: string | null;
  is_active: boolean;
}

export interface SupabaseService {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
}

export interface SupabaseTestimonial {
  id: string;
  client_name: string;
  client_position: string | null;
  client_company: string | null;
  client_avatar_url: string | null;
  testimonial_text: string;
  rating: number | null;
  is_active: boolean;
  is_featured: boolean;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  subscribed_at: string;
  source?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  is_active: boolean;
  sort_order: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}