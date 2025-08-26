"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface AppLayoutProps {
  readonly children: React.ReactNode
  readonly sidebar: React.ReactNode
  readonly header?: React.ReactNode
}

export function AppLayout({ children, sidebar, header }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const isMobile = useIsMobile()

  return (
  <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="hidden md:flex md:flex-col">
          <div className="flex flex-col flex-grow bg-sidebar border-r border-sidebar-border">
            {sidebar}
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed top-4 left-4 z-50"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex flex-col h-full bg-sidebar">
              <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                <h2 className="text-lg font-semibold text-sidebar-foreground">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {sidebar}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
  <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Header */}
        {header && (
          <div className="border-b border-border bg-background">
            {header}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
