import { NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard.service";
import { CareerService } from "@/lib/services/career";

// Simple in-memory cache (per server instance). TTL in ms.
const CACHE_TTL = 30 * 1000; // 30 seconds - adjust as needed
let cachedData: { timestamp: number; payload: unknown } | null = null;

export async function GET() {
  try {
    const now = Date.now();

    if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
      // Return cached response with cache headers
      return new NextResponse(JSON.stringify(cachedData.payload), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          // Let clients/cache proxies cache shortly; still revalidate on focus via SWR
          "Cache-Control": `s-maxage=${Math.floor(CACHE_TTL / 1000)}, stale-while-revalidate=${Math.floor(CACHE_TTL / 1000)}`,
        },
      });
    }

    const [dashboardData, applications] = await Promise.all([
      DashboardService.getDashboardData(),
      new CareerService().getAllApplications(),
    ]);

    const payload = {
      success: true,
      data: {
        dashboardData,
        totalApplications: Array.isArray(applications) ? applications.length : 0,
      },
    };

    // cache in-memory
    cachedData = { timestamp: now, payload };

    return new NextResponse(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `s-maxage=${Math.floor(CACHE_TTL / 1000)}, stale-while-revalidate=${Math.floor(CACHE_TTL / 1000)}`,
      },
    });
  } catch (error) {
    console.error("/api/dashboard error:", error);
    return NextResponse.json({ success: false, error: "Failed to load dashboard" }, { status: 500 });
  }
}
