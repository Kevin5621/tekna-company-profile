"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"

interface AppLayoutProps {
  readonly children: React.ReactNode
  readonly sidebar: React.ReactNode
  readonly header?: React.ReactNode
}

export function AppLayout({ children, sidebar, header }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex h-screen bg-background dashboard-layout">
      {/* Desktop Sidebar - Always visible on desktop */}
      <div className="hidden md:block md:w-64 md:flex-shrink-0">
        <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40">
          {sidebar}
        </div>
      </div>

      {/* Mobile Sidebar */}
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

      {/* Main Content */}
      <div className="flex flex-col flex-1 dashboard-main">
        {/* Header */}
        {header && (
          <div className="border-b border-border bg-background">
            {header}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto dashboard-scroll-container">
          <div className="w-full py-6 min-h-full dashboard-content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
