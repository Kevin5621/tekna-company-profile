import { NextRequest, NextResponse } from "next/server";
import { PublicService } from "@/lib/services/public.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate project ID
    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Increment view count
    await PublicService.incrementProjectViews(id);

    return NextResponse.json(
      { message: "View count incremented successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error tracking project view:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}