"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";
import { DashboardPageTemplate } from "@/components/dashboard/dashboard-page-template";

interface Partner {
  id: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}
interface PartnersClientProps {
  initialPartners: Partner[];
}

export default function PartnersClient({ initialPartners }: PartnersClientProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: apiPayload } = useSWR("/api/partners", fetcher, {
    fallbackData: { partners: initialPartners, success: true },
    revalidateOnFocus: true,
  });
  const partners = (apiPayload?.partners as Partner[]) || initialPartners || [];
  const loading = !apiPayload && initialPartners.length === 0;

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setDeleting(id);
    try {
  // optimistic: keep same response shape as the API
  const optimistic = partners.filter((p) => p.id !== id);
  globalMutate("/api/partners", { partners: optimistic, success: true }, false);

      const response = await fetch(`/api/partners/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        await globalMutate("/api/partners");
        toast({
          title: "Success",
          description: "Partner deleted successfully",
        });
      } else {
        throw new Error(data.error || "Failed to delete partner");
      }
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast({
        title: "Error",
        description: "Failed to delete partner",
        variant: "destructive",
      });
      await globalMutate("/api/partners");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    // trigger a revalidate on mount
    globalMutate("/api/partners");
  }, []);

  if (loading) {
    return (
      <DashboardPageTemplate
        breadcrumbs={[
          { label: "Partners", isCurrentPage: true },
        ]}
        title="Partners Management"
        description="Manage your company partners with logo, name, and description"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardPageTemplate>
    );
  }

  const actions = (
    <Button asChild>
  <Link href="/dashboard/partners/new" prefetch={false}>
        <Plus className="w-4 h-4 mr-2" />
        Add Partner
      </Link>
    </Button>
  );

  return (
    <DashboardPageTemplate
      breadcrumbs={[
        { label: "Partners", isCurrentPage: true },
      ]}
      title="Partners Management"
  description="Manage your company partners with logo images"
      actions={actions}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Partners
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last updated</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {partners.length > 0
                ? `Most recent: ${new Date(partners[0].updated_at).toLocaleDateString()}`
                : "No updates yet"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <Card
            key={partner.id}
            className="group hover:shadow-lg transition-shadow"
          >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {partner.logo_url ? (
                      <div className="relative w-20 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={partner.logo_url}
                          alt={`partner-${partner.id}`}
                          fill
                          className="object-contain p-1"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-12 bg-gray-100 rounded-lg" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/partners/edit/${partner.id}`} prefetch={false}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(partner.id, `partner-${partner.id}`)}
                      disabled={deleting === partner.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {deleting === partner.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                  </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">Added {new Date(partner.created_at).toLocaleDateString()}</div>
                </div>
              </CardContent>
          </Card>
        ))}
      </div>

      {partners.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No partners found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first partner.
            </p>
            <Button asChild>
              <Link href="/dashboard/partners/new" prefetch={false}>
                <Plus className="w-4 h-4 mr-2" />
                Add Partner
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardPageTemplate>
  );
}
