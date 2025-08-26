import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET() {
  try {
    // 1. Get all users from Supabase Auth
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error('Supabase auth error:', authError);
      throw new Error(`Supabase auth error: ${authError.message}`);
    }

    // 2. Get all user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');
    if (rolesError) {
      console.error('Supabase roles error:', rolesError);
      throw new Error(`Supabase roles error: ${rolesError.message}`);
    }

    // 3. Get all user profiles
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');
    if (profilesError) {
      console.error('Supabase profiles error:', profilesError);
      // This might not be a fatal error, a user might not have a profile
    }

    // Create maps for easy lookup
    const rolesMap = new Map(userRoles.map(r => [r.user_id, r]));
    const profilesMap = new Map(userProfiles?.map(p => [p.user_id, p]) || []);

    // 4. Combine the data
    const adminUsers = authUsers
      .filter(user => rolesMap.has(user.id)) // Only include users with a role
      .map(user => {
        const roleInfo = rolesMap.get(user.id)!; // We filtered, so it must exist
        const profileInfo = profilesMap.get(user.id);
        const displayName = (user.user_metadata && user.user_metadata.display_name) || null;
        return {
          id: user.id,
          email: user.email,
          role: roleInfo.role,
          is_active: roleInfo.is_active,
          display_name: displayName,
          profile: profileInfo || null,
        };
      });

    return NextResponse.json(adminUsers);

  } catch (error) {
    console.error('Error fetching admin users:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Debug: Check environment variables
    console.log('Environment variables check:');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('SUPABASE_SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
    
  const body = await request.json();
  const { email, password, role, display_name } = body;

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'editor'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin or editor' },
        { status: 400 }
      );
    }

    // 1. Create user in Supabase Auth, store display_name in metadata
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        display_name,
        role
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user in auth' },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // 2. Create user role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role,
        is_active: true
      });

    if (roleError) {
      console.error('Role error:', roleError);
      // Try to clean up the auth user if role creation fails
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: roleError.message },
        { status: 400 }
      );
    }

    // Note: We store display name in user_metadata; user_profiles table is optional
    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: authData.user.email,
        role,
        display_name: display_name || null
      }
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
