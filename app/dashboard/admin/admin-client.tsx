"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Shield, Edit3, UserCheck, UserX, Mail, Settings } from "lucide-react";
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
        return "Administrator";
      case "editor":
        return "Content Editor";
      case "hr":
        return "HR Manager";
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return Shield;
      case "editor":
        return Edit3;
      case "hr":
        return Users;
      default:
        return Users;
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
    <div className="grid gap-4">
      {list.map((user) => {
        const RoleIcon = getRoleIcon(user.role);
        const display = user.display_name || user.profile?.first_name || user.email;
        
        return (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">{getInitials(display)}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-lg">{display}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <RoleIcon className="h-4 w-4 text-muted-foreground" />
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    {user.is_active ? (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <UserCheck className="h-4 w-4" />
                        <span className="text-sm font-medium">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500">
                        <UserX className="h-4 w-4" />
                        <span className="text-sm font-medium">Inactive</span>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" size="sm" onClick={() => handleModalOpen(user)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {list.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === "active" 
                ? "No active users in this category"
                : activeTab === "inactive"
                ? "No inactive users in this category"
                : "No users found in this category"
              }
            </p>
            <Button onClick={() => handleModalOpen()}>
              <Plus className="mr-2 h-4 w-4" />
              Add First User
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const actions = (
    <Button onClick={() => handleModalOpen()}>
      <Plus className="h-4 w-4 mr-2" />
      Add User
    </Button>
  );

  return (
    <DashboardPageTemplate
      breadcrumbs={[{ label: "Admin", href: "/dashboard/admin" }, { label: "Admin Management", isCurrentPage: true }]}
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
            <Users className="h-5 w-5" />
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
