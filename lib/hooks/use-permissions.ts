"use client";

import { useEffect, useState } from 'react';
import { AdminAuthService, type AdminUser } from '@/lib/services/admin-auth.service';

export function usePermissions() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AdminAuthService.getCurrentAdmin();
        setCurrentUser(user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const hasPermission = (requiredRole: 'admin' | 'editor'): boolean => {
    if (!currentUser) return false;
    
    const roleHierarchy: Record<string, number> = {
      'admin': 2,
      'editor': 1
    };

    const userRoleLevel = roleHierarchy[currentUser.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    return userRoleLevel >= requiredRoleLevel;
  };

  const canManageUsers = (): boolean => hasPermission('admin');
  const canManageSettings = (): boolean => hasPermission('admin');
  const canManageContent = (): boolean => hasPermission('editor');
  const canAccessAdminPanel = (): boolean => hasPermission('admin');
  const canAccessNewsletter = (): boolean => hasPermission('admin');

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const user = await AdminAuthService.getCurrentAdmin();
      setCurrentUser(user);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh user');
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
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
    refreshUser
  };
}

export function usePermissionGuard(config: {
  requiredRole?: 'admin' | 'editor';
  redirectTo?: string;
  onUnauthorized?: () => void;
}) {
  const { currentUser, isLoading, hasPermission } = usePermissions();
  const { requiredRole, redirectTo, onUnauthorized } = config;

  useEffect(() => {
    if (!isLoading && currentUser && requiredRole) {
      if (!hasPermission(requiredRole)) {
        if (onUnauthorized) {
          onUnauthorized();
        } else if (redirectTo) {
          window.location.href = redirectTo;
        }
      }
    }
  }, [currentUser, isLoading, hasPermission, requiredRole, redirectTo, onUnauthorized]);

  return {
    currentUser,
    isLoading,
    hasPermission: requiredRole ? hasPermission(requiredRole) : true
  };
}

export function useRoleBasedUI() {
  const { currentUser } = usePermissions();

  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'editor': return 'Editor';
      default: return role;
    }
  };

  const getRoleBadgeVariant = (role: string): 'default' | 'secondary' | 'destructive' => {
    switch (role) {
      case 'admin': return 'default';
      case 'editor': return 'secondary';
      default: return 'default';
    }
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin': return 'text-primary';
      case 'editor': return 'text-secondary-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return {
    currentUser,
    getRoleDisplayName,
    getRoleBadgeVariant,
    getRoleColor
  };
}