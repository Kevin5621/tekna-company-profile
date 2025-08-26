import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/admin/languages - Get all languages
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .order('name');

    if (error) {
      console.error('Error fetching languages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch languages' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      languages: data || [],
      success: true
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
