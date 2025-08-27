"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Users, Calendar } from "lucide-react";
import Link from "next/link";

interface Partner {
  id: string;
  logo_url: string;
  created_at: string;
}

export default function PartnersClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch("/api/partners");
      const data = await response.json();

      if (data.success) {
        setPartners(data.partners);
      } else {
        throw new Error(data.error || "Failed to fetch partners");
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast({
        title: "Error",
        description: "Failed to fetch partners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (partnerId: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) {
      return;
    }

    try {
      const response = await fetch(`/api/partners/${partnerId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Partner deleted successfully",
        });
        fetchPartners();
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
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-3 items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Partners Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your company partners with logo images
          </p>
        </div>
        
        <Button size="sm" asChild>
          <Link href="/dashboard/partners/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Partner
          </Link>
        </Button>
      </div>

      {/* Partners Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Partner Companies</h2>
          <p className="text-xs text-muted-foreground">{partners.length} partners</p>
        </div>

        {partners.length === 0 ? (
          <Card className="border-2 border-dashed border-muted bg-muted/30">
            <CardContent className="p-8 text-center">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-medium mb-2">No partners yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start building your partner network by adding the first partner company.
              </p>
              <Button size="sm" asChild>
                <Link href="/dashboard/partners/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Partner
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {partners.map((partner) => (
              <Card key={partner.id} className="group hover:shadow-sm transition-all duration-200 overflow-hidden">
                <CardContent className="p-0">
                  {/* Logo Section */}
                  <div className="aspect-square bg-muted/50 flex items-center justify-center p-4 relative overflow-hidden">
                    {partner.logo_url ? (
                      <img
                        src={partner.logo_url}
                        alt="Partner logo"
                        className="w-full h-full object-contain max-w-[80%] max-h-[80%]"
                      />
                    ) : (
                      <div className="text-center space-y-1">
                        <div className="w-12 h-12 bg-muted rounded-lg mx-auto flex items-center justify-center">
                          <Users className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground">No Logo</p>
                      </div>
                    )}
                    
                    {/* Hover overlay with actions */}
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => router.push(`/dashboard/partners/edit/${partner.id}`)}
                        className="bg-background hover:bg-background/90 text-foreground h-8 px-3"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(partner.id)}
                        className="h-8 px-3"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {/* Partner Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Partner #{partner.id.slice(-4)}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Added {formatDate(partner.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
