import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const excludeId = searchParams.get('excludeId');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    let query = supabase
      .from('projects')
      .select('id')
      .eq('slug', slug)
      .eq('is_active', true);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking project slug:', error);
      return NextResponse.json(
        { error: 'Failed to check slug' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exists: !!data,
      slug: slug
    });
  } catch (error) {
    console.error('Error in check-slug API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
