"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Chart data interface
interface ChartDataItem {
  date: string;
  website_views: number;
  blog_views: number;
  career_applications: number;
  career_views: number;
}

interface DashboardChartProps {
  initialData?: ChartDataItem[];
}

export function DashboardChart({ initialData = [] }: DashboardChartProps) {
  const [timeRange, setTimeRange] = React.useState("30d")
  const [enabledSeries, setEnabledSeries] = React.useState({
    website_views: true,
    blog_views: true,
    career_applications: true,
    career_views: true
  })

  // Use real data if available, otherwise fallback to mock data
  const chartData = React.useMemo(() => {
    if (initialData && initialData.length > 0) {
      return initialData;
    }
    
         // Fallback mock data
     const mockData = [
       { date: "2024-01-01", website_views: 1250, blog_views: 12, career_applications: 8, career_views: 45 },
       { date: "2024-01-02", website_views: 1380, blog_views: 15, career_applications: 9, career_views: 52 },
       { date: "2024-01-03", website_views: 1520, blog_views: 18, career_applications: 10, career_views: 58 },
       { date: "2024-01-04", website_views: 1680, blog_views: 22, career_applications: 12, career_views: 65 },
       { date: "2024-01-05", website_views: 1850, blog_views: 25, career_applications: 14, career_views: 72 },
       { date: "2024-01-06", website_views: 2100, blog_views: 28, career_applications: 16, career_views: 80 },
       { date: "2024-01-07", website_views: 2350, blog_views: 30, career_applications: 18, career_views: 88 },
       { date: "2024-01-08", website_views: 2600, blog_views: 32, career_applications: 20, career_views: 95 },
       { date: "2024-01-09", website_views: 2850, blog_views: 35, career_applications: 22, career_views: 102 },
       { date: "2024-01-10", website_views: 3100, blog_views: 38, career_applications: 24, career_views: 110 },
       { date: "2024-01-11", website_views: 3350, blog_views: 40, career_applications: 26, career_views: 118 },
       { date: "2024-01-12", website_views: 3600, blog_views: 42, career_applications: 28, career_views: 125 },
       { date: "2024-01-13", website_views: 3850, blog_views: 45, career_applications: 30, career_views: 132 },
       { date: "2024-01-14", website_views: 4100, blog_views: 48, career_applications: 32, career_views: 140 },
       { date: "2024-01-15", website_views: 4350, blog_views: 50, career_applications: 34, career_views: 148 },
       { date: "2024-01-16", website_views: 4600, blog_views: 52, career_applications: 36, career_views: 155 },
       { date: "2024-01-17", website_views: 4850, blog_views: 55, career_applications: 38, career_views: 162 },
       { date: "2024-01-18", website_views: 5100, blog_views: 58, career_applications: 40, career_views: 170 },
       { date: "2024-01-19", website_views: 5350, blog_views: 60, career_applications: 42, career_views: 178 },
       { date: "2024-01-20", website_views: 5600, blog_views: 62, career_applications: 44, career_views: 185 },
       { date: "2024-01-21", website_views: 5850, blog_views: 65, career_applications: 46, career_views: 192 },
       { date: "2024-01-22", website_views: 6100, blog_views: 68, career_applications: 48, career_views: 200 },
       { date: "2024-01-23", website_views: 6350, blog_views: 70, career_applications: 50, career_views: 208 },
       { date: "2024-01-24", website_views: 6600, blog_views: 72, career_applications: 52, career_views: 215 },
       { date: "2024-01-25", website_views: 6850, blog_views: 75, career_applications: 54, career_views: 223 },
       { date: "2024-01-26", website_views: 7100, blog_views: 78, career_applications: 56, career_views: 230 },
       { date: "2024-01-27", website_views: 7350, blog_views: 80, career_applications: 58, career_views: 238 },
       { date: "2024-01-28", website_views: 7600, blog_views: 82, career_applications: 60, career_views: 245 },
       { date: "2024-01-29", website_views: 7850, blog_views: 85, career_applications: 62, career_views: 252 },
       { date: "2024-01-30", website_views: 8100, blog_views: 88, career_applications: 64, career_views: 260 },
       { date: "2024-01-31", website_views: 8350, blog_views: 90, career_applications: 66, career_views: 268 },
     ];
    
    return mockData;
  }, [initialData]);

  const filteredData = React.useMemo(() => {
    const daysToShow = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    return chartData.slice(-daysToShow)
  }, [chartData, timeRange])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
    })
  }

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`
    }
    return value.toString()
  }

  const toggleSeries = (series: keyof typeof enabledSeries) => {
    setEnabledSeries(prev => ({
      ...prev,
      [series]: !prev[series]
    }))
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Analitik Website</CardTitle>
          <CardDescription>
            {initialData && initialData.length > 0 
              ? "Data real dari database - Tren pertumbuhan konten dan engagement website"
              : "Data simulasi - Tren pertumbuhan konten dan engagement website"
            }
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
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
      
      {/* Chart Toggle Controls */}
      <div className="px-6 py-4 border-b">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="website-views-toggle"
              checked={enabledSeries.website_views}
              onCheckedChange={() => toggleSeries('website_views')}
            />
            <Label htmlFor="website-views-toggle" className="text-sm font-medium">
              Website Views
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="blog-views-toggle"
              checked={enabledSeries.blog_views}
              onCheckedChange={() => toggleSeries('blog_views')}
            />
            <Label htmlFor="blog-views-toggle" className="text-sm font-medium">
              Blog Views
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="career-applications-toggle"
              checked={enabledSeries.career_applications}
              onCheckedChange={() => toggleSeries('career_applications')}
            />
            <Label htmlFor="career-applications-toggle" className="text-sm font-medium">
              Career Applications
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="career-views-toggle"
              checked={enabledSeries.career_views}
              onCheckedChange={() => toggleSeries('career_views')}
            />
            <Label htmlFor="career-views-toggle" className="text-sm font-medium">
              Career Views
            </Label>
          </div>
        </div>
      </div>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="aspect-auto h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillWebsiteViews" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#f59e0b"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#f59e0b"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillBlogViews" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#3b82f6"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#3b82f6"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillCareerApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#10b981"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#10b981"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillCareerViews" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#8b5cf6"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#8b5cf6"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatDate}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatValue}
              />
              <Tooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
                        <div className="font-medium">
                          {formatDate(label)}
                        </div>
                        <div className="grid gap-1.5">
                          {payload.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-muted-foreground">
                                {item.name === 'website_views' ? 'Website Views' : 
                                 item.name === 'blog_views' ? 'Blog Views' : 
                                 item.name === 'career_applications' ? 'Career Applications' :
                                 item.name === 'career_views' ? 'Career Views' : item.name}
                              </span>
                              <span className="font-mono font-medium tabular-nums">
                                {item.value?.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              
              {/* Conditional rendering based on toggle state */}
              {enabledSeries.website_views && (
                <Area
                  dataKey="website_views"
                  type="monotone"
                  fill="url(#fillWebsiteViews)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="website_views"
                />
              )}
              {enabledSeries.blog_views && (
                <Area
                  dataKey="blog_views"
                  type="monotone"
                  fill="url(#fillBlogViews)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="blog_views"
                />
              )}
              {enabledSeries.career_applications && (
                <Area
                  dataKey="career_applications"
                  type="monotone"
                  fill="url(#fillCareerApplications)"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="career_applications"
                />
              )}
              {enabledSeries.career_views && (
                <Area
                  dataKey="career_views"
                  type="monotone"
                  fill="url(#fillCareerViews)"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="career_views"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-sm text-muted-foreground">Website Views</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">Blog Views</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Career Applications</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500" />
            <span className="text-sm text-muted-foreground">Career Views</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
