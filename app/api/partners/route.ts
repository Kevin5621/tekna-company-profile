import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/partners - Get all partners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : null;

    const supabase = await createClient();

    let query = supabase
      .from("partners")
      .select("id, logo_url, created_at, updated_at");

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching partners:", error);
      return NextResponse.json(
        { error: "Failed to fetch partners" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      partners: data || [],
      success: true,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/partners - Create a new partner
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check user permissions
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role
    const { data: roleData, error: roleError } = await supabase.rpc(
      "get_user_role",
      {
        p_user_id: user.id,
      }
    );

    if (roleError || !roleData || !["admin", "editor"].includes(roleData)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { logo_url } = body;

    // Validate required fields
    if (!logo_url || typeof logo_url !== "string") {
      return NextResponse.json({ error: "logo_url is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("partners")
      .insert({
        logo_url,
      })
      .select("id, logo_url, created_at, updated_at")
      .single();

    if (error) {
      console.error("Error creating partner:", error);
      return NextResponse.json(
        { error: "Failed to create partner" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        partner: data,
        message: "Partner created successfully",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
