"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CareerService, CareerApplication } from "@/lib/services/career";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import BackButton from "@/components/ui/back-button";
import ApplicationDetailsModal from "@/components/dashboard/career/application-details-modal";
import ApplicationCard from "@/components/dashboard/career/application-card";

const statusLabels = {
  submitted: "Submitted",
  reviewing: "Under Review",
  interview_scheduled: "Interview Scheduled",
  interview_completed: "Interview Completed",
  offered: "Offer Extended",
  accepted: "Offer Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const statusTabs = [
  { value: "all", label: "All", count: 0 },
  { value: "submitted", label: "Submitted", count: 0 },
  { value: "reviewing", label: "Reviewing", count: 0 },
  { value: "interview_scheduled", label: "Interview", count: 0 },
  { value: "interview_completed", label: "Completed", count: 0 },
  { value: "offered", label: "Offered", count: 0 },
  { value: "accepted", label: "Accepted", count: 0 },
  { value: "rejected", label: "Rejected", count: 0 },
  { value: "withdrawn", label: "Withdrawn", count: 0 },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<CareerApplication | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    notes: "",
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    application: CareerApplication | null;
  }>({ open: false, application: null });

  const careerService = useMemo(() => new CareerService(), []);

  const loadApplications = useCallback(async () => {
    try {
      const data = await careerService.getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error("Error loading applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [careerService]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const filteredApplications = useMemo(() => {
    let filtered = applications.filter((app) => {
      const matchesSearch =
        !searchTerm ||
        app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position?.title.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    if (activeTab !== "all") {
      filtered = filtered.filter((app) => app.status === activeTab);
    }

    return filtered;
  }, [applications, activeTab, searchTerm]);

  const tabCounts = useMemo(() => {
    const counts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return statusTabs.map(tab => ({
      ...tab,
      count: counts[tab.value] || 0
    }));
  }, [applications]);

  const handleViewDetails = (application: CareerApplication) => {
    setSelectedApp(application);
    setStatusUpdate({
      status: application.status,
      notes: "",
    });
    setShowDetails(true);
  };

  const handleQuickStatusUpdate = async (applicationId: string, newStatus: CareerApplication["status"]) => {
    try {
      await careerService.updateApplicationStatus(applicationId, newStatus);
      toast.success(`Application status updated to ${statusLabels[newStatus]}`);
      loadApplications();
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedApp) return;

    try {
      await careerService.updateApplicationStatus(
        selectedApp.id,
        statusUpdate.status as CareerApplication["status"],
        statusUpdate.notes
      );

      toast.success("Application status updated successfully");
      setShowDetails(false);
      loadApplications();
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
  };

  const handleDeleteApplication = async () => {
    if (!deleteDialog.application) return;

    try {
      const success = await careerService.deleteApplication(deleteDialog.application.id);
      if (success) {
        toast.success("Application deleted successfully");
        loadApplications();
      } else {
        toast.error("Failed to delete application");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    } finally {
      setDeleteDialog({ open: false, application: null });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb
        items={[
          { label: "Career", href: "/dashboard/career" },
          { label: "Applications", href: "/dashboard/career/applications" },
          { label: "Application List", isCurrentPage: true },
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/career" label="Back to Career" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Career Applications
          </h1>
          <p className="text-muted-foreground">
            Manage and review job applications
          </p>
        </div>
      </div>

      {/* Search */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Search className="h-4 w-4 text-primary" />
            </div>
            <Input
              placeholder="Search applications by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-sm"
            />
          </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9">
          {tabCounts.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
              {tab.label} ({tab.count})
            </TabsTrigger>
          ))}
        </TabsList>

        {statusTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            {filteredApplications.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      {searchTerm
                        ? "No applications found matching your search."
                        : `No ${tab.label.toLowerCase()} applications found.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onViewDetails={handleViewDetails}
                onQuickStatusUpdate={handleQuickStatusUpdate}
                onDeleteApplication={(app) => setDeleteDialog({ open: true, application: app })}
              />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        application={selectedApp}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) =>
        setDeleteDialog({ open, application: open ? deleteDialog.application : null })
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the application from{" "}
              <strong>
                {deleteDialog.application?.first_name}{" "}
                {deleteDialog.application?.last_name}
              </strong>{" "}
              for the position{" "}
              <strong>{deleteDialog.application?.position?.title}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteApplication}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
