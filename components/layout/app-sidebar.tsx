"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ClientOnly } from "@/components/ui/client-only"
import Image from "next/image"
import { useSession } from "@/components/session-provider"
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  Settings, 
  HelpCircle, 
  Search,
  Plus,
  Mail,
  Shield
} from "lucide-react"

interface NavigationItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: ('admin' | 'editor')[]
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ['admin', 'editor']
  },
  {
    title: "Proyek",
    href: "/dashboard/projects",
    icon: FolderOpen,
    roles: ['admin', 'editor']
  },
  {
    title: "Blog",
    href: "/dashboard/blog",
    icon: FileText,
    roles: ['admin', 'editor']
  },
  {
    title: "Admin",
    href: "/dashboard/admin",
    icon: Shield,
    roles: ['admin']
  },
  {
    title: "Newsletter",
    href: "/dashboard/newsletter",
    icon: Mail,
    roles: ['admin']
  }
]

const bottomNavigationItems: NavigationItem[] = [
  {
    title: "Pengaturan",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ['admin']
  },
  {
    title: "Bantuan",
    href: "/dashboard/help",
    icon: HelpCircle,
    roles: ['admin', 'editor']
  },
  {
    title: "Pencarian",
    href: "/dashboard/search",
    icon: Search,
    roles: ['admin', 'editor']
  }
]

function NavigationItems() {
  const pathname = usePathname()

  // Show all items for now - role filtering will be handled by RLS policies
  const filteredItems = navigationItems

  return (
    <nav className="flex-1 px-4 space-y-2">
      {filteredItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

function BottomNavigationItems() {
  const pathname = usePathname()

  // Show all items for now - role filtering will be handled by RLS policies
  const filteredItems = bottomNavigationItems

  return (
    <nav className="px-4 space-y-2">
      {filteredItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

export function AppSidebarNew() {
  const { user } = useSession()

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo/Brand */}
      <div className="flex items-center justify-center p-2 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center justify-center">
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

      {/* Quick Create Button */}
      <div className="p-4">
        <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Quick Create
        </Button>
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
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.email || 'Admin'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email ? 'Admin' : 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}