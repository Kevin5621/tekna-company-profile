import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PATCH /api/admin/users/[id] - Update a specific user
export async function PATCH(request: NextRequest, context: unknown) {
  const { params } = (context as { params: { id: string } }) || {};
  try {
    const supabase = await createClient();

    // Check user permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user role
    const { data: roleData, error: roleError } = await supabase.rpc('get_user_role', {
      p_user_id: user.id
    });

    if (roleError || !roleData || !['admin', 'editor'].includes(roleData)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      slug,
      logo_url,
      website,
      email,
      phone,
      industry,
      partnership_type,
      partnership_since,
      is_featured,
      sort_order,
      translations
    } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Use the database function to update partner with translations
    const { data: partnerId, error } = await supabase.rpc('update_partner_with_translations', {
      p_partner_id: params.id,
      p_name: name,
      p_slug: slug,
      p_logo_url: logo_url,
      p_website: website,
      p_email: email,
      p_phone: phone,
      p_industry: industry,
      p_partnership_type: partnership_type,
      p_partnership_since: partnership_since,
      p_is_featured: is_featured,
      p_sort_order: sort_order,
      p_translations: translations || null
    });

    if (error) {
      console.error('Error updating partner:', error);
      return NextResponse.json(
        { error: 'Failed to update partner' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: partnerId,
      message: 'Partner updated successfully',
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
