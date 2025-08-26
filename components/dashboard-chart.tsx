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
  posts: number;
  projects: number;
  views: number;
}

interface DashboardChartProps {
  initialData?: ChartDataItem[];
}

export function DashboardChart({ initialData = [] }: DashboardChartProps) {
  const [timeRange, setTimeRange] = React.useState("30d")
  const [enabledSeries, setEnabledSeries] = React.useState({
    posts: true,
    projects: true,
    views: true
  })

  // Use real data if available, otherwise fallback to mock data
  const chartData = React.useMemo(() => {
    if (initialData && initialData.length > 0) {
      return initialData;
    }
    
    // Fallback mock data
    const mockData = [
      { date: "2024-01-01", posts: 12, projects: 8, views: 1250 },
      { date: "2024-01-02", posts: 15, projects: 9, views: 1380 },
      { date: "2024-01-03", posts: 18, projects: 10, views: 1520 },
      { date: "2024-01-04", posts: 22, projects: 12, views: 1680 },
      { date: "2024-01-05", posts: 25, projects: 14, views: 1850 },
      { date: "2024-01-06", posts: 28, projects: 16, views: 2100 },
      { date: "2024-01-07", posts: 30, projects: 18, views: 2350 },
      { date: "2024-01-08", posts: 32, projects: 20, views: 2600 },
      { date: "2024-01-09", posts: 35, projects: 22, views: 2850 },
      { date: "2024-01-10", posts: 38, projects: 24, views: 3100 },
      { date: "2024-01-11", posts: 40, projects: 26, views: 3350 },
      { date: "2024-01-12", posts: 42, projects: 28, views: 3600 },
      { date: "2024-01-13", posts: 45, projects: 30, views: 3850 },
      { date: "2024-01-14", posts: 48, projects: 32, views: 4100 },
      { date: "2024-01-15", posts: 50, projects: 34, views: 4350 },
      { date: "2024-01-16", posts: 52, projects: 36, views: 4600 },
      { date: "2024-01-17", posts: 55, projects: 38, views: 4850 },
      { date: "2024-01-18", posts: 58, projects: 40, views: 5100 },
      { date: "2024-01-19", posts: 60, projects: 42, views: 5350 },
      { date: "2024-01-20", posts: 62, projects: 44, views: 5600 },
      { date: "2024-01-21", posts: 65, projects: 46, views: 5850 },
      { date: "2024-01-22", posts: 68, projects: 48, views: 6100 },
      { date: "2024-01-23", posts: 70, projects: 50, views: 6350 },
      { date: "2024-01-24", posts: 72, projects: 52, views: 6600 },
      { date: "2024-01-25", posts: 75, projects: 54, views: 6850 },
      { date: "2024-01-26", posts: 78, projects: 56, views: 7100 },
      { date: "2024-01-27", posts: 80, projects: 58, views: 7350 },
      { date: "2024-01-28", posts: 82, projects: 60, views: 7600 },
      { date: "2024-01-29", posts: 85, projects: 62, views: 7850 },
      { date: "2024-01-30", posts: 88, projects: 64, views: 8100 },
      { date: "2024-01-31", posts: 90, projects: 66, views: 8350 },
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
              id="posts-toggle"
              checked={enabledSeries.posts}
              onCheckedChange={() => toggleSeries('posts')}
            />
            <Label htmlFor="posts-toggle" className="text-sm font-medium">
              Artikel
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="projects-toggle"
              checked={enabledSeries.projects}
              onCheckedChange={() => toggleSeries('projects')}
            />
            <Label htmlFor="projects-toggle" className="text-sm font-medium">
              Proyek
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="views-toggle"
              checked={enabledSeries.views}
              onCheckedChange={() => toggleSeries('views')}
            />
            <Label htmlFor="views-toggle" className="text-sm font-medium">
              Views
            </Label>
          </div>
        </div>
      </div>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="aspect-auto h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillPosts" x1="0" y1="0" x2="0" y2="1">
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
                <linearGradient id="fillProjects" x1="0" y1="0" x2="0" y2="1">
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
                <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
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
                                {item.name === 'posts' ? 'Artikel' : 
                                 item.name === 'projects' ? 'Proyek' : 'Views'}
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
              {enabledSeries.views && (
                <Area
                  dataKey="views"
                  type="monotone"
                  fill="url(#fillViews)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="views"
                />
              )}
              {enabledSeries.posts && (
                <Area
                  dataKey="posts"
                  type="monotone"
                  fill="url(#fillPosts)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="posts"
                />
              )}
              {enabledSeries.projects && (
                <Area
                  dataKey="projects"
                  type="monotone"
                  fill="url(#fillProjects)"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="projects"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">Artikel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Proyek</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-sm text-muted-foreground">Views</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
