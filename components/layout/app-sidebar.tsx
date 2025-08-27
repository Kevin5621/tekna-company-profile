"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ClientOnly } from "@/components/ui/client-only";
import Image from "next/image";
import { useSession } from "@/components/session-provider";
import {
  AdminAuthService,
  type AdminUser,
} from "@/lib/services/admin-auth.service";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Settings,
  Mail,
  Shield,
  User,
  Footprints,
  Briefcase,
  Handshake,
} from "lucide-react";

interface NavigationItem {
  title: string;
  href: string;
  // allow passing SVG props (e.g. strokeWidth) to Lucide icons
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { className?: string }>;
  roles: ("admin" | "editor" | "hr")[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "editor", "hr"],
  },
  {
    title: "Proyek",
    href: "/dashboard/projects",
    icon: FolderOpen,
    roles: ["admin", "editor"],
  },
  {
    title: "Blog",
    href: "/dashboard/blog",
    icon: FileText,
    roles: ["admin", "editor"],
  },
  {
    title: "Partners",
    href: "/dashboard/partners",
    icon: Handshake,
    roles: ["admin", "editor"],
  },
  {
    title: "Career",
    href: "/dashboard/career",
    icon: Briefcase,
    roles: ["admin", "hr"],
  },
  {
    title: "Footer",
    href: "/dashboard/footer",
    icon: Footprints,
    roles: ["admin"],
  },
  {
    title: "Admin",
    href: "/dashboard/admin",
    icon: Shield,
    roles: ["admin"],
  },
  {
    title: "Newsletter",
    href: "/dashboard/newsletter",
    icon: Mail,
    roles: ["admin"],
  },
];

const bottomNavigationItems: NavigationItem[] = [
  {
    title: "Pengaturan",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["admin", "editor", "hr"],
  },
  {
    title: "Profile",
    href: "/dashboard/settings/profile",
    icon: User,
    roles: ["admin", "editor", "hr"],
  },
];

function NavigationItems() {
  const pathname = usePathname();
  const { user } = useSession();
  const [currentAdmin, setCurrentAdmin] = React.useState<AdminUser | null>(
    null
  );

  React.useEffect(() => {
    if (user) {
      AdminAuthService.getCurrentAdmin()
        .then(setCurrentAdmin)
        .catch(() => setCurrentAdmin(null));
    }
  }, [user]);

  // Filter items based on user role
  const filteredItems = navigationItems.filter((item) => {
    if (!currentAdmin) return false;
    return item.roles.includes(currentAdmin.role);
  });

  return (
    <nav className="flex-1 px-4 pt-4 space-y-2">
      {filteredItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              "hover:bg-sidebar-accent hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "bg-sidebar-accent text-white font-semibold shadow-sm"
                : "text-white hover:text-white"
            )}
          >
            <Icon
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className={cn(
                "w-4 h-4 transition-colors duration-200",
                isActive ? "text-white" : "text-white group-hover:text-white"
              )}
            />
            <span className="text-white">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function BottomNavigationItems() {
  const pathname = usePathname();
  const { user } = useSession();
  const [currentAdmin, setCurrentAdmin] = React.useState<AdminUser | null>(
    null
  );

  React.useEffect(() => {
    if (user) {
      AdminAuthService.getCurrentAdmin()
        .then(setCurrentAdmin)
        .catch(() => setCurrentAdmin(null));
    }
  }, [user]);

  // Filter items based on user role
  const filteredItems = bottomNavigationItems.filter((item) => {
    if (!currentAdmin) return false;
    return item.roles.includes(currentAdmin.role);
  });

  return (
    <nav className="px-4 pt-4 space-y-2">
      {filteredItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              "hover:bg-sidebar-accent hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "bg-sidebar-accent text-white font-semibold shadow-sm"
                : "text-white hover:text-white"
            )}
          >
            <Icon
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className={cn(
                "w-4 h-4 transition-colors duration-200",
                isActive ? "text-white" : "text-white group-hover:text-white"
              )}
            />
            <span className="text-white">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppSidebarNew() {
  const { user } = useSession();

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo/Brand */}
      <div className="flex items-center justify-center p-2 border-b border-sidebar-border">
        {/* disable next/link prefetch to avoid preloading many dashboard routes */}
        <Link href="/dashboard" prefetch={false} className="flex items-center justify-center">
          <Image
            src="/logo.webp"
            alt="Tekna Company Logo"
            width={100}
            height={25}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* Main Navigation */}
      <ClientOnly>
        <NavigationItems />
      </ClientOnly>

      {/* Bottom Navigation */}
      <ClientOnly>
        <BottomNavigationItems />
      </ClientOnly>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.email || "Admin"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email ? "Admin" : "Loading..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
