"use client";

import ProfileSettingsForm from "@/components/dashboard/profile-settings-form";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[
          { label: "Pengaturan", href: "/dashboard/settings" },
          { label: "Profil Pengguna", isCurrentPage: true },
        ]}
      />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Pengguna</h1>
        <p className="text-muted-foreground">
          Kelola informasi profil, email, dan kata sandi Anda.
        </p>
      </div>
      <ProfileSettingsForm />
    </div>
  );
}
