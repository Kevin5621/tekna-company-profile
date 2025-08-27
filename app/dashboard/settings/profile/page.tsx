"use client";

import ProfileSettingsForm from "@/components/dashboard/profile-settings-form";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[
          { label: "Settings", href: "/dashboard/settings" },
          { label: "User Profile", isCurrentPage: true },
        ]}
      />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile information, email, and password.
        </p>
      </div>
      <ProfileSettingsForm />
    </div>
  );
}
