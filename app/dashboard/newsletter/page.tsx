"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconDownload, IconMail, IconUsers, IconActivity } from "@tabler/icons-react";
import { PaginationService, type PaginatedResult } from "@/lib/services/pagination.service";
import { SearchFilter } from "@/components/ui/search-filter";
import { Pagination } from "@/components/ui/pagination";
import { DashboardBreadcrumb } from '@/components/ui/dashboard-breadcrumb';
import BackButton from '@/components/ui/back-button';

interface NewsletterSubscription {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  subscribed_at: string;
  source?: string;
}

export default function NewsletterPage() {
  const [subscriptions, setSubscriptions] = useState<PaginatedResult<NewsletterSubscription> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize] = useState(20);

  const loadSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await PaginationService.getPaginatedNewsletterSubscriptions(
        currentPage,
        pageSize,
        searchQuery
      );
      setSubscriptions(result);
    } catch (error) {
      console.error("Error loading newsletter subscriptions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportCSV = () => {
    if (!subscriptions?.data) return;

    const headers = ["Email", "First Name", "Last Name", "Status", "Subscribed Date", "Source"];
    const csvContent = [
      headers.join(","),
      ...subscriptions.data.map(sub => [
        sub.email,
        sub.first_name || "",
        sub.last_name || "",
        sub.is_active ? "Active" : "Inactive",
        new Date(sub.subscribed_at).toLocaleDateString(),
        sub.source || ""
      ].join(','))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStats = () => {
    if (!subscriptions) return { total: 0, active: 0, inactive: 0 };
    
    const total = subscriptions.total_count;
    const active = subscriptions.data.filter(sub => sub.is_active).length;
    const inactive = total - active;
    
    return { total, active, inactive };
  };

  const stats = getStats();

  if (isLoading && !subscriptions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading newsletter subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb 
        items={[
          { label: "Newsletter", href: "/dashboard/newsletter" },
          { label: "Manajemen Newsletter", isCurrentPage: true }
        ]}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter Management</h1>
          <p className="text-muted-foreground">
            Manage newsletter subscriptions and settings
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <IconDownload className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Subscribers
            </CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time subscribers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Subscribers
            </CardTitle>
            <IconMail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently receiving emails
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactive Subscribers
            </CardTitle>
            <IconActivity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              Unsubscribed users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        placeholder="Search by email, first name, or last name..."
        className="bg-card p-4 rounded-lg border"
      />

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscriptions</CardTitle>
          <CardDescription>
            Manage and monitor newsletter subscriber list
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions?.data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No subscriptions found matching your search" : "No newsletter subscriptions yet"}
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions?.data.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconMail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{subscription.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {subscription.first_name && subscription.last_name
                          ? `${subscription.first_name} ${subscription.last_name}`
                          : "No name provided"
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={subscription.is_active ? "default" : "secondary"}>
                      {subscription.is_active ? "Active" : "Inactive"}
                    </Badge>
                    
                    {subscription.source && (
                      <Badge variant="outline">
                        {subscription.source}
                      </Badge>
                    )}
                    
                    <div className="text-sm text-muted-foreground">
                      {new Date(subscription.subscribed_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {subscriptions && subscriptions.total_pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={subscriptions.total_pages}
          totalCount={subscriptions.total_count}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}