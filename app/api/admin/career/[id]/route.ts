import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('career_positions')
      .update({
        title: body.title,
        slug: body.slug,
        summary: body.summary,
        description: body.description,
        requirements: body.requirements,
        benefits: body.benefits,
        category_id: body.category_id,
        location_id: body.location_id,
        type_id: body.type_id,
        level_id: body.level_id,
        salary_min: body.salary_min,
        salary_max: body.salary_max,
        salary_currency: body.salary_currency,
        salary_type: body.salary_type,
        application_deadline: body.application_deadline,
        start_date: body.start_date,
        remote_allowed: body.remote_allowed,
        travel_required: body.travel_required,
        travel_percentage: body.travel_percentage,
        featured: body.featured,
        urgent: body.urgent,
        status: body.status,
        seo_title: body.seo_title,
        seo_description: body.seo_description,
        seo_keywords: body.seo_keywords,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating career position:', error);
      return NextResponse.json(
        { error: 'Failed to update career position' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error in career position update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = await createClient();

    const { error } = await supabase
      .from('career_positions')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting career position:', error);
      return NextResponse.json(
        { error: 'Failed to delete career position' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Career position deleted successfully'
    });
  } catch (error) {
    console.error('Error in career position delete API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
