"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconPlus, IconUsers } from "@tabler/icons-react";
import { AdminAuthService, type AdminUser } from "@/lib/services/admin-auth.service";
import { AdminUserModal } from "./admin-user-modal";
import { AdminStats } from "./admin-stats";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";

export default function AdminManagementPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const loadAdminUsers = async () => {
    try {
      setIsLoading(true);
      const users = await AdminAuthService.getAllAdminUsers();
      setAdminUsers(users);
    } catch (error) {
      console.error("Error loading admin users:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    loadAdminUsers();
  };

  const getRoleBadgeVariant = (role: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (role) {
      case "admin":
        return "destructive";
      case "editor":
        return "secondary";
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
      default:
        return role;
    }
  };

  const getFilteredUsers = () => {
    switch (activeTab) {
      case "active":
        return adminUsers.filter(user => user.is_active);
      case "inactive":
        return adminUsers.filter(user => !user.is_active);
      default:
        return adminUsers;
    }
  };

  const filteredUsers = getFilteredUsers();

  const renderUserList = (users: AdminUser[]) => (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-4">
            {(() => {
              const display = user.display_name || user.profile?.first_name || user.email;
              const initials = display
                .split(" ")
                .map(s => s[0])
                .slice(0,2)
                .join("");
              return (
                <>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">{initials}</span>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleModalOpen(user)}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      ))}

      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found in this category
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb 
        items={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Manajemen Admin", isCurrentPage: true }
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground">
            Manage admin users, roles, and system settings
          </p>
        </div>
        <Button onClick={() => handleModalOpen()}>
          <IconPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <AdminStats adminUsers={adminUsers} />

      {/* Admin Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            Admin Users
          </CardTitle>
          <CardDescription>
            Manage system administrators and content editors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Users ({adminUsers.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({adminUsers.filter(u => u.is_active).length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({adminUsers.filter(u => !u.is_active).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {renderUserList(filteredUsers)}
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              {renderUserList(adminUsers.filter(u => u.is_active))}
            </TabsContent>

            <TabsContent value="inactive" className="mt-6">
              {renderUserList(adminUsers.filter(u => !u.is_active))}
            </TabsContent>
          </Tabs>


        </CardContent>
      </Card>

      {/* Admin User Modal */}
      <AdminUserModal
        isOpen={showUserModal}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        user={editingUser}
        mode={editingUser ? 'edit' : 'create'}
      />
    </div>
  );
}