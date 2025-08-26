'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"
import Link from "next/link"

interface DashboardBreadcrumbProps {
  items: Array<{
    label: string
    href?: string
    isCurrentPage?: boolean
  }>
}

export function DashboardBreadcrumb({ items }: DashboardBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            {item.isCurrentPage ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : item.href ? (
              <BreadcrumbLink asChild>
                <Link href={item.href}>{item.label}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
