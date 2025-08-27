import React, { ReactNode } from "react";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface DashboardFormTemplateProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
  actions?: ReactNode;
}

export const DashboardFormTemplate = React.memo(function DashboardFormTemplate({
  breadcrumbs,
  title,
  description,
  backHref,
  backLabel,
  children,
  actions,
}: DashboardFormTemplateProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb items={breadcrumbs} />

      {/* Header */}
      <div className="flex flex-col gap-4">
        {/* Back Button */}
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" asChild>
            <Link href={backHref}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backLabel}
            </Link>
          </Button>
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>

        {/* Title and Description */}
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
});
