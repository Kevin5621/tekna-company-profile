import React, { ReactNode } from "react";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface DashboardPageTemplateProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export const DashboardPageTemplate = React.memo(function DashboardPageTemplate({
  breadcrumbs,
  title,
  description,
  children,
  actions,
}: DashboardPageTemplateProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb items={breadcrumbs} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>

      {/* Content */}
      {children}
    </div>
  );
});
