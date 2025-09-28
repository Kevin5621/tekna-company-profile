import { createClient } from "@/lib/supabase/client";

export interface AboutUs {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Type aliases for cleaner code
type AboutUsCreate = Omit<AboutUs, "id" | "created_at" | "updated_at">;
type AboutUsUpdate = Partial<AboutUsCreate>;
type FAQCreate = Omit<FAQ, "id" | "created_at" | "updated_at">;
type FAQUpdate = Partial<FAQCreate>;
type TeamMemberCreate = Omit<TeamMember, "id" | "created_at" | "updated_at">;
type TeamMemberUpdate = Partial<TeamMemberCreate>;

export class ContentManagementService {
  private readonly supabase = createClient();

  // About Us CRUD
  async getAboutUs(): Promise<AboutUs[]> {
    try {
      const { data, error } = await this.supabase
        .from("about_us")
        .select("*")
        .order("sort_order");

      if (error) {
        console.error("Error fetching about us:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getAboutUs:", error);
      return [];
    }
  }

  async getAboutUsById(id: string): Promise<AboutUs | null> {
    try {
      const { data, error } = await this.supabase
        .from("about_us")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching about us by id:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getAboutUsById:", error);
      return null;
    }
  }

  async createAboutUs(aboutUs: AboutUsCreate): Promise<AboutUs | null> {
    try {
      const { data, error } = await this.supabase
        .from("about_us")
        .insert(aboutUs)
        .select()
        .single();

      if (error) {
        console.error("Error creating about us:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in createAboutUs:", error);
      return null;
    }
  }

  async updateAboutUs(id: string, aboutUs: AboutUsUpdate): Promise<AboutUs | null> {
    try {
      const { data, error } = await this.supabase
        .from("about_us")
        .update(aboutUs)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating about us:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in updateAboutUs:", error);
      return null;
    }
  }

  async deleteAboutUs(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("about_us")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting about us:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteAboutUs:", error);
      return false;
    }
  }

  // FAQ CRUD
  async getFAQs(): Promise<FAQ[]> {
    try {
      const { data, error } = await this.supabase
        .from("faqs")
        .select("*")
        .order("sort_order");

      if (error) {
        console.error("Error fetching FAQs:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getFAQs:", error);
      return [];
    }
  }

  async getFAQById(id: string): Promise<FAQ | null> {
    try {
      const { data, error } = await this.supabase
        .from("faqs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching FAQ by id:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getFAQById:", error);
      return null;
    }
  }

  async createFAQ(faq: FAQCreate): Promise<FAQ | null> {
    try {
      const { data, error } = await this.supabase
        .from("faqs")
        .insert(faq)
        .select()
        .single();

      if (error) {
        console.error("Error creating FAQ:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in createFAQ:", error);
      return null;
    }
  }

  async updateFAQ(id: string, faq: FAQUpdate): Promise<FAQ | null> {
    try {
      const { data, error } = await this.supabase
        .from("faqs")
        .update(faq)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating FAQ:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in updateFAQ:", error);
      return null;
    }
  }

  async deleteFAQ(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("faqs")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting FAQ:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteFAQ:", error);
      return false;
    }
  }

  // Team Members CRUD
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const { data, error } = await this.supabase
        .from("team_members")
        .select("*")
        .order("sort_order");

      if (error) {
        console.error("Error fetching team members:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getTeamMembers:", error);
      return [];
    }
  }

  async getTeamMemberById(id: string): Promise<TeamMember | null> {
    try {
      const { data, error } = await this.supabase
        .from("team_members")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching team member by id:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getTeamMemberById:", error);
      return null;
    }
  }

  async createTeamMember(teamMember: TeamMemberCreate): Promise<TeamMember | null> {
    try {
      const { data, error } = await this.supabase
        .from("team_members")
        .insert(teamMember)
        .select()
        .single();

      if (error) {
        console.error("Error creating team member:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in createTeamMember:", error);
      return null;
    }
  }

  async updateTeamMember(id: string, teamMember: TeamMemberUpdate): Promise<TeamMember | null> {
    try {
      const { data, error } = await this.supabase
        .from("team_members")
        .update(teamMember)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating team member:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in updateTeamMember:", error);
      return null;
    }
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("team_members")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting team member:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteTeamMember:", error);
      return false;
    }
  }

  // Public methods for frontend display
  async getPublicAboutUs(): Promise<AboutUs[]> {
    try {
      const { data, error } = await this.supabase
        .from("about_us")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) {
        console.error("Error fetching public about us:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getPublicAboutUs:", error);
      return [];
    }
  }

  async getPublicFAQs(): Promise<FAQ[]> {
    try {
      const { data, error } = await this.supabase
        .from("faqs")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) {
        console.error("Error fetching public FAQs:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getPublicFAQs:", error);
      return [];
    }
  }

  async getPublicTeamMembers(): Promise<TeamMember[]> {
    try {
      const { data, error } = await this.supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) {
        console.error("Error fetching public team members:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getPublicTeamMembers:", error);
      return [];
    }
  }
}
