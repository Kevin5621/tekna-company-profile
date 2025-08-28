export class SlugValidationClientService {
  static async checkBlogPostSlugExists(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/admin/blog/check-slug?slug=${encodeURIComponent(slug)}${excludeId ? `&excludeId=${excludeId}` : ''}`);
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Error checking blog post slug:', error);
      return false;
    }
  }

  static async checkCareerPositionSlugExists(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/admin/career/check-slug?slug=${encodeURIComponent(slug)}${excludeId ? `&excludeId=${excludeId}` : ''}`);
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Error checking career position slug:', error);
      return false;
    }
  }

  static async checkProjectSlugExists(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/admin/projects/check-slug?slug=${encodeURIComponent(slug)}${excludeId ? `&excludeId=${excludeId}` : ''}`);
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Error checking project slug:', error);
      return false;
    }
  }

  static async checkCategorySlugExists(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/admin/categories/check-slug?slug=${encodeURIComponent(slug)}${excludeId ? `&excludeId=${excludeId}` : ''}`);
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Error checking category slug:', error);
      return false;
    }
  }

  static async checkCareerCategorySlugExists(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/admin/career/categories/check-slug?slug=${encodeURIComponent(slug)}${excludeId ? `&excludeId=${excludeId}` : ''}`);
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Error checking career category slug:', error);
      return false;
    }
  }

  static async checkPartnerSlugExists(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/admin/partners/check-slug?slug=${encodeURIComponent(slug)}${excludeId ? `&excludeId=${excludeId}` : ''}`);
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Error checking partner slug:', error);
      return false;
    }
  }
}
