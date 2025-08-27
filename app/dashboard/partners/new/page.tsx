import { Metadata } from "next";
import { Suspense } from "react";
import PartnerForm from "../partner-form";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardFormTemplate } from "@/components/dashboard/dashboard-form-template";

export const metadata: Metadata = {
  title: "Add New Partner",
  description: "Add a new partner to your company profile",
};

export default function NewPartnerPage() {
  return (
    <DashboardFormTemplate
      breadcrumbs={[
        { label: "Partners", href: "/dashboard/partners" },
        { label: "New Partner", isCurrentPage: true },
      ]}
      title="Add New Partner"
      description="Create a new partner with logo, name, and description"
      backHref="/dashboard/partners"
      backLabel="Back to Partners"
    >
      <Suspense fallback={<Skeleton className="w-full h-96" />}>
        <div className="dashboard-form-container">
          <PartnerForm />
        </div>
      </Suspense>
    </DashboardFormTemplate>
  );
}
