"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconPlus, IconUsers } from "@tabler/icons-react";
import type { AdminUser } from "@/lib/services/admin-auth.service";
import { AdminUserModal } from "./admin-user-modal";
import { AdminStats } from "./admin-stats";
import { DashboardPageTemplate } from "@/components/dashboard/dashboard-page-template";

interface AdminClientProps {
  readonly initialUsers: AdminUser[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminClient({ initialUsers }: AdminClientProps) {
  const { data } = useSWR("/api/admin/users", fetcher, {
    fallbackData: { success: true, data: initialUsers },
    revalidateOnFocus: true,
  });

  const users: AdminUser[] = (data?.data as AdminUser[]) || initialUsers || [];
  const getInitials = (display: string) =>
    display
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("");

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const handleModalOpen = (user: AdminUser | null = null) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleModalClose = () => {
    setEditingUser(null);
    setShowUserModal(false);
  };

  const handleSuccess = () => {
    handleModalClose();
    // revalidate
    void fetch("/api/admin/users").then(() => window.location.reload());
  };

  const getRoleBadgeVariant = (
    role: string
  ): "default" | "destructive" | "secondary" | "outline" => {
    switch (role) {
      case "admin":
        return "destructive";
      case "editor":
        return "secondary";
      case "hr":
        return "default";
      default:
        return "outline";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "editor":
        return "Editor";
      case "hr":
        return "HR";
      default:
        return role;
    }
  };

  const getFilteredUsers = () => {
    switch (activeTab) {
      case "active":
        return users.filter((user) => user.is_active);
      case "inactive":
        return users.filter((user) => !user.is_active);
      default:
        return users;
    }
  };

  const filteredUsers = getFilteredUsers();

  const renderUserList = (list: AdminUser[]) => (
    <div className="space-y-4">
      {list.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-4">
            {(() => {
              const display = user.display_name || user.profile?.first_name || user.email;
              return (
                <>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">{getInitials(display)}</span>
                  </div>
                  <div>
                    <div className="font-medium">{display}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={getRoleBadgeVariant(user.role)}>
              {getRoleDisplayName(user.role)}
            </Badge>

            <div className="text-sm text-muted-foreground">
              {user.is_active ? (
                <span className="text-primary">Active</span>
              ) : (
                <span className="text-destructive">Inactive</span>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleModalOpen(user)}>
                Edit
              </Button>
            </div>
          </div>
        </div>
      ))}

      {list.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No users found in this category</div>
      )}
    </div>
  );

  // SWR provides fallbackData for instant UI; no explicit loading screen needed here

  const actions = (
    <Button onClick={() => handleModalOpen()}>
      <IconPlus className="h-4 w-4 mr-2" />
      Add User
    </Button>
  );

  return (
    <DashboardPageTemplate
      breadcrumbs={[{ label: "Admin", href: "/dashboard/admin" }, { label: "Manajemen Admin", isCurrentPage: true }]}
      title="Admin Management"
      description="Manage admin users, roles, and system settings"
      actions={actions}
    >
      {/* Stats Cards */}
      <AdminStats adminUsers={users} />

      {/* Admin Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            Admin Users
          </CardTitle>
          <CardDescription>Manage system administrators and content editors</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({users.filter((u) => u.is_active).length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({users.filter((u) => !u.is_active).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">{renderUserList(filteredUsers)}</TabsContent>
            <TabsContent value="active" className="mt-6">{renderUserList(users.filter((u) => u.is_active))}</TabsContent>
            <TabsContent value="inactive" className="mt-6">{renderUserList(users.filter((u) => !u.is_active))}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AdminUserModal isOpen={showUserModal} onClose={handleModalClose} onSuccess={handleSuccess} user={editingUser} mode={editingUser ? "edit" : "create"} />
    </DashboardPageTemplate>
  );
}
