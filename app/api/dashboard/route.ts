import { NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard.service";
import { CareerService } from "@/lib/services/career";

export async function GET() {
  try {
    const [dashboardData, applications] = await Promise.all([
      DashboardService.getDashboardData(),
      new CareerService().getAllApplications(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        dashboardData,
        totalApplications: Array.isArray(applications) ? applications.length : 0,
      },
    });
  } catch (error) {
    console.error("/api/dashboard error:", error);
    return NextResponse.json({ success: false, error: "Failed to load dashboard" }, { status: 500 });
  }
}
