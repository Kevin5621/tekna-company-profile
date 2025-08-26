"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  IconDashboard, 
  IconArticle, 
  IconFolder, 
  IconUsers, 
  IconSettings, 
  IconLetterA,
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
  IconBriefcase
} from "@tabler/icons-react";
import { AdminAuthService, AdminUser } from "@/lib/services/admin-auth.service";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole: 'admin' | 'editor' | 'hr';
  badge?: string;
  children?: Omit<NavItem, 'children'>[];
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: IconDashboard,
    requiredRole: "editor"
  },
  {
    title: "Blog Posts",
    href: "/dashboard/blog",
    icon: IconArticle,
    requiredRole: "editor",
    children: [
      {
        title: "All Posts",
        href: "/dashboard/blog",
        icon: IconArticle,
        requiredRole: "editor"
      },
      {
        title: "New Post",
        href: "/dashboard/blog/new",
        icon: IconArticle,
        requiredRole: "editor"
      }
    ]
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: IconFolder,
    requiredRole: "editor",
    children: [
      {
        title: "All Projects",
        href: "/dashboard/projects",
        icon: IconFolder,
        requiredRole: "editor"
      },
      {
        title: "New Project",
        href: "/dashboard/projects/new",
        icon: IconFolder,
        requiredRole: "editor"
      }
    ]
  },
  {
    title: "Career Management",
    href: "/dashboard/career",
    icon: IconBriefcase,
    requiredRole: "admin",
    children: [
      {
        title: "All Positions",
        href: "/dashboard/career",
        icon: IconBriefcase,
        requiredRole: "admin"
      },
      {
        title: "New Position",
        href: "/dashboard/career/new",
        icon: IconBriefcase,
        requiredRole: "admin"
      },
      {
        title: "Applications",
        href: "/dashboard/career/applications",
        icon: IconUsers,
        requiredRole: "admin"
      },
      {
        title: "Categories",
        href: "/dashboard/career/categories",
        icon: IconFolder,
        requiredRole: "admin"
      },
      {
        title: "Locations",
        href: "/dashboard/career/locations",
        icon: IconFolder,
        requiredRole: "admin"
      }
    ]
  },
  {
    title: "Admin Management",
    href: "/dashboard/admin",
    icon: IconUsers,
    requiredRole: "admin",
    badge: "Admin Only"
  },
  {
    title: "Newsletter",
    href: "/dashboard/newsletter",
    icon: IconLetterA,
    requiredRole: "admin",
    badge: "Admin Only"
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: IconSettings,
    requiredRole: "admin"
  }
];

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await AdminAuthService.getCurrentAdmin();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading current user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (requiredRole: 'admin' | 'editor' | 'hr') => {
    if (!currentUser) return false;
    
    const roleHierarchy = {
      'admin': 3,
      'editor': 2,
      'hr': 1
    };

    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
  };

  const filteredNavigation = navigationItems.filter(item => 
    hasPermission(item.requiredRole)
  );

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await AdminAuthService.logout();
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-16 flex-col items-center justify-center border-r bg-background">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex h-screen flex-col border-r bg-background transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <span className="font-semibold">Tekna Admin</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <IconChevronRight className="h-4 w-4" />
          ) : (
            <IconChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = isActiveRoute(item.href);
            const hasChildren = item.children && item.children.length > 0;
            
            return (
              <div key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-10",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Button>
                </Link>

                {/* Sub-navigation */}
                {!isCollapsed && hasChildren && isActive && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children!.map((child) => {
                      const isChildActive = isActiveRoute(child.href);
                      return (
                        <Link key={child.href} href={child.href}>
                          <Button
                            variant={isChildActive ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start gap-3 h-8 text-sm"
                          >
                            <child.icon className="h-3 w-3 flex-shrink-0" />
                            <span>{child.title}</span>
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        {!isCollapsed && currentUser && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">
                  {currentUser.profile?.first_name?.[0] || ''}{currentUser.profile?.last_name?.[0] || ''}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {currentUser.profile?.first_name || ''} {currentUser.profile?.last_name || ''}
                </p>
                <p className="text-xs text-muted-foreground truncate capitalize">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "w-full gap-3 h-10",
            isCollapsed && "justify-center px-2"
          )}
        >
          <IconLogout className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
