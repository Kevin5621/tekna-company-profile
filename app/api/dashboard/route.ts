import { NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard.service";
import { CareerService } from "@/lib/services/career";
import { getCached, setCached } from "@/lib/cache/redis";

// Simple in-memory fallback cache (per server instance). TTL in ms.
const CACHE_TTL = 30 * 1000; // 30 seconds - adjust as needed
let fallbackCache: { timestamp: number; payload: unknown } | null = null;

export async function GET() {
  try {
    const now = Date.now();

    // try redis first
    const redisKey = "dashboard:summary";
    const redisCached = await getCached(redisKey);
    if (redisCached) {
      return new NextResponse(JSON.stringify(redisCached), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `s-maxage=${Math.floor(CACHE_TTL / 1000)}, stale-while-revalidate=${Math.floor(CACHE_TTL / 1000)}`,
        },
      });
    }

    // fallback to in-memory
    if (fallbackCache && now - fallbackCache.timestamp < CACHE_TTL) {
      return new NextResponse(JSON.stringify(fallbackCache.payload), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `s-maxage=${Math.floor(CACHE_TTL / 1000)}, stale-while-revalidate=${Math.floor(CACHE_TTL / 1000)}`,
        },
      });
    }

    const [dashboardData, applications, applicationsByDate] = await Promise.all([
      DashboardService.getDashboardData(),
      new CareerService().getAllApplications(),
      new CareerService().getApplicationsGroupedByDate(90), // Get last 90 days
    ]);

    const payload = {
      success: true,
      data: {
        dashboardData,
        totalApplications: Array.isArray(applications) ? applications.length : 0,
        applicationsByDate,
      },
    };

    // try to set redis cache (best-effort)
    try {
      await setCached(redisKey, payload, Math.floor(CACHE_TTL / 1000));
    } catch {
      // ignore Redis set errors (best-effort)
    }

    // set fallback
    fallbackCache = { timestamp: now, payload };

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
