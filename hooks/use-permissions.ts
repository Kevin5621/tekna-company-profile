import { useState, useEffect } from "react";
import { AdminAuthService, AdminUser } from "@/lib/services/admin-auth.service";

export interface PermissionConfig {
  requiredRole: "admin" | "editor" | "hr";
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function usePermissions() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await AdminAuthService.getCurrentAdmin();
      setCurrentUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user");
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (requiredRole: "admin" | "editor" | "hr"): boolean => {
    if (!currentUser) return false;

    const roleHierarchy = {
      admin: 3,
      editor: 2,
      hr: 1,
    };

    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
  };

  const canManageUsers = (): boolean => {
    return hasPermission("admin");
  };

  const canManageSettings = (): boolean => {
    return hasPermission("admin");
  };

  const canManageContent = (): boolean => {
    return hasPermission("editor");
  };

  const canAccessAdminPanel = (): boolean => {
    return hasPermission("admin");
  };

  const canAccessNewsletter = (): boolean => {
    return hasPermission("admin");
  };

  const refreshUser = () => {
    loadCurrentUser();
  };

  return {
    currentUser,
    isLoading,
    error,
    hasPermission,
    canManageUsers,
    canManageSettings,
    canManageContent,
    canAccessAdminPanel,
    canAccessNewsletter,
    refreshUser,
  };
}

// Hook for conditional rendering based on permissions
export function usePermissionGuard(config: PermissionConfig) {
  const { hasPermission, isLoading } = usePermissions();
  const { requiredRole, fallback, redirectTo } = config;

  const hasAccess = hasPermission(requiredRole);

  useEffect(() => {
    if (!isLoading && !hasAccess && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [hasAccess, isLoading, redirectTo]);

  return {
    hasAccess,
    isLoading,
    fallback: fallback || null,
  };
}

// Hook for role-based UI rendering
export function useRoleBasedUI() {
  const { currentUser, hasPermission } = usePermissions();

  const getRoleDisplayName = (role: string): string => {
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

  const getRoleBadgeVariant = (
    role: string
  ): "default" | "secondary" | "destructive" | "outline" => {
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

  const getRoleColor = (role: string): string => {
    switch (role) {
      case "admin":
        return "text-destructive";
      case "editor":
        return "text-secondary-foreground";
      case "hr":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  return {
    currentUser,
    hasPermission,
    getRoleDisplayName,
    getRoleBadgeVariant,
    getRoleColor,
  };
}
