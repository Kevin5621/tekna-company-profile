import { AppLayout } from "@/components/layout/app-layout";
import { AppSidebarNew } from "@/components/layout/app-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";
import { DashboardAuthGuard } from "@/components/dashboard-auth-guard";
import { DashboardErrorBoundary } from "@/components/dashboard-error-boundary";
import { ToasterWrapper } from "@/components/ui/toaster-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardErrorBoundary>
      <DashboardAuthGuard>
        <AppLayout sidebar={<AppSidebarNew />} header={<AdminHeader />}>
          {children}
          <ToasterWrapper />
        </AppLayout>
      </DashboardAuthGuard>
    </DashboardErrorBoundary>
  );
}
