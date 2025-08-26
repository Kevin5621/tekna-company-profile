'use server';

import { createClient } from "@/lib/supabase/server";

export async function getFeaturedTestimonialsAction() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select(`
        id,
        client_name,
        client_position,
        client_company,
        client_avatar_url,
        testimonial_translations(content)
      `)
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching featured testimonials:', error);
    throw new Error('Gagal mengambil data testimonial.');
  }
}
