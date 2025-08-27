"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import PartnerForm from "../../partner-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPartnerPage() {
  const params = useParams();
  const partnerId = params.id as string;

  return (
    <Suspense fallback={<Skeleton className="w-full h-96" />}>
      <PartnerForm partnerId={partnerId} />
    </Suspense>
  );
}
