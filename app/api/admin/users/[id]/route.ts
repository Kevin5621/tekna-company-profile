import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
);

export async function PATCH(request: NextRequest, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    // type-guard: detect Promise-like params without using `any`
    const isThenable = <T,>(v: unknown): v is Promise<T> =>
      typeof (v as { then?: unknown }).then === 'function';

    const resolvedParams = isThenable<{ id: string }>(params) ? await params : params;
    const userId = (resolvedParams as { id: string }).id;
    const body = await request.json();

    const { display_name, role, is_active, profile } = body;

    // Update auth user metadata (display_name)
    if (typeof display_name === 'string') {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { display_name }
      });
      if (error) {
        console.error('Error updating auth user metadata:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    // Update role if provided
    if (role || typeof is_active === 'boolean') {
  const updates: Record<string, unknown> = {};
      if (role) updates.role = role;
      if (typeof is_active === 'boolean') updates.is_active = is_active;

      const { error: roleError } = await supabase
        .from('user_roles')
        .update(updates)
        .eq('user_id', userId);

      if (roleError) {
        console.error('Error updating user role:', roleError);
        return NextResponse.json({ error: roleError.message }, { status: 400 });
      }
    }

    // Update profile fields (only non-name fields like avatar_url or preferences)
    if (profile && (profile.avatar_url || profile.preferences)) {
  const updatable: Record<string, unknown> = {};
      if (profile.avatar_url) updatable.avatar_url = profile.avatar_url;
      if (profile.preferences) updatable.preferences = profile.preferences;

  const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({ user_id: userId, ...updatable })
        .select()
        .single();

      if (profileError) {
        console.error('Error upserting user_profiles:', profileError);
        return NextResponse.json({ error: profileError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PATCH /api/admin/users/[id]:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
