import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Minimal typed surface for admin auth operations used here (avoid `any`)
type SupabaseAdmin = {
  auth?: {
    admin?: {
      updateUserById?: (
        id: string,
        opts: { user_metadata: Record<string, unknown> }
      ) => Promise<{ error?: unknown }>;
    };
  };
};

// PATCH /api/admin/users/[id] - Update a specific admin user's role, active flag and display name
export async function PATCH(request: NextRequest, context: unknown) {
  const { params } = (context as { params: { id: string } }) || {};

  const supabase = await createClient();

  // helper: ensure caller authenticated and has role
  async function ensureCallerIsAdminOrEditor() {
    const {
      data: { user: caller },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !caller) return { ok: false, status: 401 } as const;

    const { data: callerRole, error: callerRoleError } = await supabase.rpc("get_user_role", { p_user_id: caller.id });
    if (callerRoleError || !callerRole || !["admin", "editor"].includes(callerRole)) {
      return { ok: false, status: 403 } as const;
    }
    return { ok: true } as const;
  }

  async function updateRoleAndActive(userId: string, role?: string, is_active?: boolean) {
    if (typeof role === "undefined" && typeof is_active === "undefined") return;
    const updates: Record<string, unknown> = {};
    if (typeof role !== "undefined") updates.role = role;
    if (typeof is_active !== "undefined") updates.is_active = is_active;

    const { error: roleUpdateError } = await supabase.from("user_roles").update(updates).eq("user_id", userId);
    if (roleUpdateError) {
      console.error("Error updating user_roles:", roleUpdateError);
      throw new Error("Failed to update user role");
    }
  }

  async function upsertProfile(userId: string, displayName?: string | null) {
    if (typeof displayName === "undefined") return;
    const parts = (displayName || "").trim().split(/\s+/);
    const first_name = parts.shift() || null;
    const last_name = parts.length ? parts.join(" ") : null;

    const { data: existingProfile, error: profileSelectError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (profileSelectError) {
      const code = (profileSelectError as unknown as { code?: string })?.code;
      if (code && code !== "PGRST116") {
        console.error("Error checking user_profiles:", profileSelectError);
      }
    }

    if (existingProfile) {
      const { error: profileUpdateError } = await supabase.from("user_profiles").update({ first_name, last_name }).eq("user_id", userId);
      if (profileUpdateError) console.error("Error updating user_profiles:", profileUpdateError);
    } else {
      const { error: profileInsertError } = await supabase.from("user_profiles").insert({ user_id: userId, first_name, last_name });
      if (profileInsertError) console.error("Error inserting user_profiles:", profileInsertError);
    }
  }

  async function updateAuthMetadata(userId: string, displayName?: string | null) {
    if (typeof displayName === "undefined") return;
    try {
      const admin = supabase as unknown as SupabaseAdmin;
      if (admin?.auth?.admin?.updateUserById) {
        const { error: updateUserError } = await admin.auth!.admin!.updateUserById(userId, { user_metadata: { display_name: displayName } });
        if (updateUserError) console.error("Error updating auth user metadata:", updateUserError);
      }
    } catch (e) {
      console.warn("Auth metadata update not available, skipping.", e);
    }
  }

  try {
    const check = await ensureCallerIsAdminOrEditor();
    if (!check.ok) {
      return NextResponse.json({ error: check.status === 401 ? "Unauthorized" : "Insufficient permissions" }, { status: check.status });
    }

    const body = await request.json();
    const { display_name, role, is_active } = body as {
      display_name?: string | null;
      role?: string;
      is_active?: boolean;
    };

    if (role && !["admin", "editor", "hr"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await updateRoleAndActive(params.id, role, is_active);
    await upsertProfile(params.id, display_name);
    await updateAuthMetadata(params.id, display_name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error in PATCH /api/admin/users/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
