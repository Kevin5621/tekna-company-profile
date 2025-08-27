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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partners Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your company partners with logo images and maintain professional relationships
          </p>
        </div>
        
        <Button asChild>
          <Link href="/dashboard/partners/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Partner
          </Link>
        </Button>
      </div>

      {/* Partners Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Partner Companies</h2>
          <p className="text-sm text-muted-foreground">{partners.length} partners found</p>
        </div>

        {partners.length === 0 ? (
          <Card className="border-2 border-dashed border-muted bg-muted/30">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No partners yet</h3>
              <p className="text-muted-foreground mb-6">
                Start building your partner network by adding the first partner company.
              </p>
              <Button asChild>
                <Link href="/dashboard/partners/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Partner
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <Card key={partner.id} className="group hover:shadow-md transition-all duration-200 overflow-hidden">
                <CardContent className="p-0">
                  {/* Logo Section */}
                  <div className="aspect-square bg-muted/50 flex items-center justify-center p-6 relative overflow-hidden">
                    {partner.logo_url ? (
                      <img
                        src={partner.logo_url}
                        alt="Partner logo"
                        className="w-full h-full object-contain max-w-[80%] max-h-[80%]"
                      />
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-muted rounded-lg mx-auto flex items-center justify-center">
                          <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">No Logo</p>
                      </div>
                    )}
                    
                    {/* Hover overlay with actions */}
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => router.push(`/dashboard/partners/edit/${partner.id}`)}
                        className="bg-background hover:bg-background/90 text-foreground"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(partner.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
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
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
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
