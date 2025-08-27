"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Shield,
  Edit3,
  UserCheck,
  UserX,
} from "lucide-react";
import type { AdminUser } from "@/lib/services/admin-auth.service";

interface AdminStatsProps {
  readonly adminUsers: AdminUser[];
}

export function AdminStats({ adminUsers }: AdminStatsProps) {
  const stats = {
    totalUsers: adminUsers.length,
    admins: adminUsers.filter((user) => user.role === "admin").length,
    editors: adminUsers.filter((user) => user.role === "editor").length,
    hrUsers: adminUsers.filter((user) => user.role === "hr").length,
    activeUsers: adminUsers.filter((user) => user.is_active).length,
    inactiveUsers: adminUsers.filter((user) => !user.is_active).length,
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "All admin users",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Administrators",
      value: stats.admins,
      description: "Full system access",
      icon: Shield,
      color: "text-red-600",
    },
    {
      title: "Content Editors",
      value: stats.editors,
      description: "Content management",
      icon: Edit3,
      color: "text-green-600",
    },
    {
      title: "HR Users",
      value: stats.hrUsers,
      description: "HR management",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      description: "Currently active",
      icon: UserCheck,
      color: "text-emerald-600",
    },
    {
      title: "Inactive Users",
      value: stats.inactiveUsers,
      description: "Deactivated accounts",
      icon: UserX,
      color: "text-gray-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
