import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET single partner
export async function GET(request: NextRequest, context: unknown) {
  const { params } = (context as { params: { id: string } }) || {};
  try {
    const supabase = await createClient();
    
    const { data: partner, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        success: false,
        error: 'Partner not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      partner
    });

  } catch (error) {
    console.error('Error fetching partner:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// PUT update partner
export async function PUT(request: NextRequest, context: unknown) {
  const { params } = (context as { params: { id: string } }) || {};
  try {
    const supabase = await createClient();
    
    // Check user permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Check user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'editor'].includes(profile.role)) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions'
      }, { status: 403 });
    }

    const body = await request.json();
    const { name, logo_url, description, website, is_active } = body;

    if (!name?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Partner name is required'
      }, { status: 400 });
    }

    const { data: partner, error } = await supabase
      .from('partners')
      .update({
        name: name.trim(),
        logo_url: logo_url?.trim() || null,
        description: description?.trim() || null,
        website: website?.trim() || null,
        is_active: Boolean(is_active),
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to update partner'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      partner
    });

  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// DELETE partner
export async function DELETE(request: NextRequest, context: unknown) {
  const { params } = (context as { params: { id: string } }) || {};
  try {
    const supabase = await createClient();
    
    // Check user permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Check user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'editor'].includes(profile.role)) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions'
      }, { status: 403 });
    }

    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to delete partner'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
