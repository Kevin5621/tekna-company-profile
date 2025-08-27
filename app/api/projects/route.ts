import { NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard.service";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import { getCached, setCached } from "@/lib/cache/redis";

export async function GET() {
  try {
    const cacheKey = "projects:list";
    const cached = await getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": `s-maxage=30, stale-while-revalidate=30`,
        },
      });
    }

    const projects = await DashboardService.getProjects();
    const payload = { success: true, data: projects };
    await setCached(cacheKey, payload, 30);

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": `s-maxage=30, stale-while-revalidate=30`,
      },
    });
  } catch (error) {
    console.error("/api/projects GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await ClientDashboardService.createProject(body);

    // invalidate cache
    await setCached("projects:list", null, 0);
    await setCached("dashboard:summary", null, 0);

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("/api/projects POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 });
  }
}
