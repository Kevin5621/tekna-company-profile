"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import PartnerForm from "../../partner-form";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardFormTemplate } from "@/components/dashboard/dashboard-form-template";

export default function EditPartnerPage() {
  const params = useParams();
  const partnerId = params.id as string;

  return (
    <DashboardFormTemplate
      breadcrumbs={[
        { label: "Partners", href: "/dashboard/partners" },
        { label: "Edit Partner", isCurrentPage: true },
      ]}
      title="Edit Partner"
      description="Update partner information and translations"
      backHref="/dashboard/partners"
      backLabel="Back to Partners"
    >
      <Suspense fallback={<Skeleton className="w-full h-96" />}>
        <div className="dashboard-form-container">
          <PartnerForm partnerId={partnerId} />
        </div>
      </Suspense>
    </DashboardFormTemplate>
  );
}
