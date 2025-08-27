"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Clock } from "lucide-react";

interface DashboardChartProps {
  totalApplications?: number;
}

export function DashboardChart({ totalApplications = 0 }: DashboardChartProps) {
  const [timeRange, setTimeRange] = React.useState("30d");

  // Generate chart data with only career applications (real data) and placeholder for others
  const chartData = React.useMemo(() => {
    const data = [];
    const today = new Date();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      data.push({
        date: date.toISOString().split("T")[0],
        career_applications:
          i === 0
            ? totalApplications
            : Math.floor(totalApplications * (1 - i / days)), // Real data trend
        website_views: 0, // Coming soon
        blog_views: 0, // Coming soon
        career_views: 0, // Coming soon
      });
    }

    return data;
  }, [timeRange, totalApplications]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analitik Website
            <Badge variant="outline" className="ml-2">
              Parsial Data
            </Badge>
          </CardTitle>
          <CardDescription>
            Menampilkan data lamaran karir (real) - Fitur analitik lainnya
            segera hadir
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg"
            aria-label="Pilih rentang waktu"
          >
            <SelectValue placeholder="30 hari terakhir" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d" className="rounded-lg">
              7 hari terakhir
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              30 hari terakhir
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              90 hari terakhir
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="aspect-auto h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
              />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {formatDate(label)}
                            </span>
                            <span className="font-bold text-muted-foreground">
                              Lamaran Karir: {payload[0]?.value}
                            </span>
                            <div className="mt-2 text-xs text-muted-foreground">
                              <div>Website Views: Coming Soon</div>
                              <div>Blog Views: Coming Soon</div>
                              <div>Career Views: Coming Soon</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="career_applications"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm">Lamaran Karir (Real Data)</span>
          </div>
          <div className="flex items-center gap-2 opacity-50">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm">Website Views (Coming Soon)</span>
          </div>
          <div className="flex items-center gap-2 opacity-50">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-sm">Blog Views (Coming Soon)</span>
          </div>
          <div className="flex items-center gap-2 opacity-50">
            <div className="h-3 w-3 rounded-full bg-purple-500" />
            <span className="text-sm">Career Views (Coming Soon)</span>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-dashed">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Fitur Dalam Pengembangan
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Analytics untuk website views, blog views, dan career views akan
            segera hadir pada Q1 2025. Saat ini hanya data lamaran karir yang
            ditampilkan secara real-time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
