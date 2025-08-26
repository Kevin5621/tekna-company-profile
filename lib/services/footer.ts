import { createClient } from '@/lib/supabase/client';

export interface FooterSection {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  links: FooterLink[];
}

export interface FooterLink {
  id: string;
  footer_section_id: string;
  title: string;
  url: string;
  icon?: string;
  is_external: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialMedia {
  id: string;
  platform: string;
  icon: string;
  url: string;
  color?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  company_id?: string;
  type: string;
  icon: string;
  label: string;
  value: string;
  href?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;
  short_description?: string;
}

export interface NewsletterSettings {
  id: string;
  title: string;
  description?: string;
  success_message: string;
  button_text: string;
  placeholder_text: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class FooterService {
  private supabase = createClient();

  // Footer Sections CRUD
  async getFooterSections(): Promise<FooterSection[]> {
    try {
      const { data: sections, error: sectionsError } = await this.supabase
        .from('footer_sections')
        .select('*')
        .order('sort_order');

      if (sectionsError) {
        console.error('Error fetching footer sections:', sectionsError);
        return [];
      }

      const sectionsWithLinks = await Promise.all(
        sections.map(async (section) => {
          const { data: links, error: linksError } = await this.supabase
            .from('footer_links')
            .select('*')
            .eq('footer_section_id', section.id)
            .order('sort_order');

          if (linksError) {
            console.error('Error fetching footer links:', linksError);
            return { ...section, links: [] };
          }

          return { ...section, links: links || [] };
        })
      );

      return sectionsWithLinks;
    } catch (error) {
      console.error('Error in getFooterSections:', error);
      return [];
    }
  }

  async createFooterSection(section: Omit<FooterSection, 'id' | 'created_at' | 'updated_at' | 'links'>): Promise<FooterSection> {
    const { data, error } = await this.supabase
      .from('footer_sections')
      .insert(section)
      .select()
      .single();

    if (error) throw error;
    return { ...data, links: [] };
  }

  async updateFooterSection(id: string, section: Partial<FooterSection>): Promise<FooterSection> {
    const { data, error } = await this.supabase
      .from('footer_sections')
      .update(section)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { ...data, links: [] };
  }

  async deleteFooterSection(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('footer_sections')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Footer Links CRUD
  async getFooterLinks(): Promise<FooterLink[]> {
    const { data, error } = await this.supabase
      .from('footer_links')
      .select('*')
      .order('sort_order');

    if (error) throw error;
    return data || [];
  }

  async createFooterLink(link: Omit<FooterLink, 'id' | 'created_at' | 'updated_at'>): Promise<FooterLink> {
    const { data, error } = await this.supabase
      .from('footer_links')
      .insert(link)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateFooterLink(id: string, link: Partial<FooterLink>): Promise<FooterLink> {
    const { data, error } = await this.supabase
      .from('footer_links')
      .update(link)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteFooterLink(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('footer_links')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Social Media CRUD
  async getSocialMedia(): Promise<SocialMedia[]> {
    try {
      const { data, error } = await this.supabase
        .from('social_media')
        .select('*')
        .order('sort_order');

      if (error) {
        console.error('Error fetching social media:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSocialMedia:', error);
      return [];
    }
  }

  async createSocialMedia(social: Omit<SocialMedia, 'id' | 'created_at' | 'updated_at'>): Promise<SocialMedia> {
    const { data, error } = await this.supabase
      .from('social_media')
      .insert(social)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSocialMedia(id: string, social: Partial<SocialMedia>): Promise<SocialMedia> {
    const { data, error } = await this.supabase
      .from('social_media')
      .update(social)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteSocialMedia(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('social_media')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Contact Info CRUD
  async getContactInfo(): Promise<ContactInfo[]> {
    try {
      const { data, error } = await this.supabase
        .from('contact_info')
        .select('*')
        .order('sort_order');

      if (error) {
        console.error('Error fetching contact info:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getContactInfo:', error);
      return [];
    }
  }

  async createContactInfo(contact: Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>): Promise<ContactInfo> {
    const { data, error } = await this.supabase
      .from('contact_info')
      .insert(contact)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateContactInfo(id: string, contact: Partial<ContactInfo>): Promise<ContactInfo> {
    const { data, error } = await this.supabase
      .from('contact_info')
      .update(contact)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteContactInfo(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('contact_info')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Newsletter settings management
  async getAllNewsletterSettings(): Promise<NewsletterSettings[]> {
    try {
      const { data, error } = await this.supabase
        .from('newsletter_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching newsletter settings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllNewsletterSettings:', error);
      return [];
    }
  }

  async createNewsletterSettings(settings: Omit<NewsletterSettings, 'id' | 'created_at' | 'updated_at'>): Promise<NewsletterSettings> {
    const { data, error } = await this.supabase
      .from('newsletter_settings')
      .insert(settings)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateNewsletterSettings(id: string, settings: Partial<NewsletterSettings>): Promise<NewsletterSettings> {
    const { data, error } = await this.supabase
      .from('newsletter_settings')
      .update(settings)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteNewsletterSettings(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('newsletter_settings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getCompanyInfo(): Promise<CompanyInfo | null> {
    try {
      const { data: company, error: companyError } = await this.supabase
        .from('companies')
        .select('*')
        .eq('slug', 'tekna')
        .eq('is_active', true)
        .single();

      if (companyError) {
        console.error('Error fetching company info:', companyError);
        return null;
      }

      // Get company translation for Indonesian
      const { data: translation, error: translationError } = await this.supabase
        .from('company_translations')
        .select(`
          description,
          short_description,
          languages!inner(code)
        `)
        .eq('company_id', company.id)
        .eq('languages.code', 'id')
        .single();

      if (translationError) {
        console.error('Error fetching company translation:', translationError);
      }

      return {
        ...company,
        description: translation?.description,
        short_description: translation?.short_description,
      };
    } catch (error) {
      console.error('Error in getCompanyInfo:', error);
      return null;
    }
  }

  // Public methods for frontend display
  async getPublicFooterSections(): Promise<FooterSection[]> {
    try {
      const { data: sections, error: sectionsError } = await this.supabase
        .from('footer_sections')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (sectionsError) {
        console.error('Error fetching footer sections:', sectionsError);
        return [];
      }

      const sectionsWithLinks = await Promise.all(
        sections.map(async (section) => {
          const { data: links, error: linksError } = await this.supabase
            .from('footer_links')
            .select('*')
            .eq('footer_section_id', section.id)
            .eq('is_active', true)
            .order('sort_order');

          if (linksError) {
            console.error('Error fetching footer links:', linksError);
            return { ...section, links: [] };
          }

          return { ...section, links: links || [] };
        })
      );

      return sectionsWithLinks;
    } catch (error) {
      console.error('Error in getPublicFooterSections:', error);
      return [];
    }
  }

  async getPublicSocialMedia(): Promise<SocialMedia[]> {
    try {
      const { data, error } = await this.supabase
        .from('social_media')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching social media:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPublicSocialMedia:', error);
      return [];
    }
  }

  async getPublicContactInfo(): Promise<ContactInfo[]> {
    try {
      const { data, error } = await this.supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching contact info:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPublicContactInfo:', error);
      return [];
    }
  }

  async getPublicNewsletterSettings(): Promise<NewsletterSettings | null> {
    try {
      const { data: settings, error: settingsError } = await this.supabase
        .from('newsletter_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (settingsError) {
        console.error('Error fetching newsletter settings:', settingsError);
        return null;
      }

      // Get newsletter translation for Indonesian
      const { data: translation, error: translationError } = await this.supabase
        .from('newsletter_settings_translations')
        .select(`
          title,
          description,
          success_message,
          button_text,
          placeholder_text,
          languages!inner(code)
        `)
        .eq('newsletter_settings_id', settings.id)
        .eq('languages.code', 'id')
        .single();

      if (translationError) {
        console.error('Error fetching newsletter translation:', translationError);
      }

      return {
        ...settings,
        ...(translation && {
          title: translation.title,
          description: translation.description,
          success_message: translation.success_message,
          button_text: translation.button_text,
          placeholder_text: translation.placeholder_text,
        }),
      };
    } catch (error) {
      console.error('Error in getPublicNewsletterSettings:', error);
      return null;
    }
  }

  async subscribeToNewsletter(email: string, firstName?: string, lastName?: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('newsletter_subscriptions')
        .insert({
          email,
          first_name: firstName,
          last_name: lastName,
          source: 'website',
          is_active: true,
        });

      if (error) {
        console.error('Error subscribing to newsletter:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in subscribeToNewsletter:', error);
      return false;
    }
  }
}
