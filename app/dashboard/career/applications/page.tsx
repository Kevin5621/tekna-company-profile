"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CareerService, CareerApplication } from "@/lib/services/career";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Eye,
  FileText,
  MessageSquare,
  Calendar,
  User,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Globe,
  X,
  Github,
  Linkedin,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import BackButton from "@/components/ui/back-button";

const statusColors = {
  submitted: "bg-secondary text-secondary-foreground",
  reviewing: "bg-warning text-warning-foreground",
  interview_scheduled: "bg-primary text-primary-foreground",
  interview_completed: "bg-success text-success-foreground",
  offered: "bg-success text-success-foreground",
  accepted: "bg-success text-success-foreground",
  rejected: "bg-destructive text-destructive-foreground",
  withdrawn: "bg-muted text-muted-foreground",
};

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getQuickActions = (application: CareerApplication) => {
    const actions = [];

    if (application.status === "submitted") {
      actions.push(
        <Button
          key="review"
          size="sm"
          variant="outline"
          onClick={() => handleQuickStatusUpdate(application.id, "reviewing")}
          className="text-xs h-6 px-2"
        >
          <Eye className="h-3 w-3 mr-1" />
          Review
        </Button>
      );
    }

    if (application.status === "reviewing") {
      actions.push(
        <Button
          key="interview"
          size="sm"
          variant="outline"
          onClick={() => handleQuickStatusUpdate(application.id, "interview_scheduled")}
          className="text-xs h-6 px-2"
        >
          <Calendar className="h-3 w-3 mr-1" />
          Schedule
        </Button>
      );
    }

    if (application.status === "interview_completed") {
      actions.push(
        <Button
          key="offer"
          size="sm"
          variant="outline"
          onClick={() => handleQuickStatusUpdate(application.id, "offered")}
          className="text-xs h-6 px-2"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Offer
        </Button>
      );
    }

    if (application.status === "offered") {
      actions.push(
        <Button
          key="accept"
          size="sm"
          variant="outline"
          onClick={() => handleQuickStatusUpdate(application.id, "accepted")}
          className="text-xs h-6 px-2"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Accept
        </Button>
      );
    }

    if (["submitted", "reviewing", "interview_scheduled", "interview_completed", "offered"].includes(application.status)) {
      actions.push(
        <Button
          key="reject"
          size="sm"
          variant="outline"
          onClick={() => handleQuickStatusUpdate(application.id, "rejected")}
          className="text-xs h-6 px-2 text-destructive hover:text-destructive"
        >
          <XCircle className="h-3 w-3 mr-1" />
          Reject
        </Button>
      );
    }

    if (application.status === "rejected") {
      actions.push(
        <Button
          key="delete"
          size="sm"
          variant="destructive"
          onClick={() => setDeleteDialog({ open: true, application })}
          className="text-xs h-6 px-2"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Delete
        </Button>
      );
    }

    return actions;
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
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm truncate">
                              {application.first_name} {application.last_name}
                            </CardTitle>
                            <Badge className={`${statusColors[application.status]} mt-0.5`} variant="secondary">
                              {statusLabels[application.status]}
                            </Badge>
                          </div>
                        </div>

                        <CardDescription className="space-y-0.5 mt-2">
                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <a href={`mailto:${application.email}`} className="text-primary hover:underline truncate">
                              {application.email}
                            </a>
                          </div>
                          {application.phone && (
                            <div className="flex items-center gap-2 text-xs">
                              <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <a href={`tel:${application.phone}`} className="text-primary hover:underline">
                                {application.phone}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium text-muted-foreground">Position:</span>
                            <span className="truncate">{application.position?.title || "Unknown Position"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span>Applied: {formatDate(application.applied_at)}</span>
                          </div>
                        </CardDescription>
                      </div>

                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(application)}
                          className="whitespace-nowrap text-xs h-6"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        <div className="flex flex-wrap gap-0.5">
                          {getQuickActions(application)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {application.cover_letter && (
                    <CardContent className="pt-0 pb-2">
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-muted-foreground">Cover Letter Preview:</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {application.cover_letter}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Application Details Modal - Custom Implementation */}
      {showDetails && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowDetails(false)}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="relative bg-background border rounded-lg shadow-lg w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold truncate">
                    Application Details
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground truncate">
                    {selectedApp?.first_name} {selectedApp?.last_name} • {selectedApp?.position?.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge className={`${statusColors[selectedApp?.status || "submitted"]} flex-shrink-0`} variant="secondary">
                    {statusLabels[selectedApp?.status || "submitted"]}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                    className="h-8 w-8 p-0 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-4">
                {selectedApp && (
                  <div className="space-y-3">
                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

                      {/* Personal Info Card - Large */}
                      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm md:col-span-8">
                        <div className="px-6">
                          <div className="flex items-center gap-2 mb-4">
                            <User className="h-4 w-4" />
                            <h3 className="text-base font-semibold">Personal Information</h3>
                          </div>
                        </div>
                        <div className="px-6 space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Full Name</Label>
                              <p className="font-medium text-sm">{selectedApp.first_name} {selectedApp.last_name}</p>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Email</Label>
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <a href={`mailto:${selectedApp.email}`} className="text-primary hover:underline text-sm truncate">
                                  {selectedApp.email}
                                </a>
                              </div>
                            </div>
                            {selectedApp.phone && (
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Phone</Label>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  <a href={`tel:${selectedApp.phone}`} className="text-primary hover:underline text-sm">
                                    {selectedApp.phone}
                                  </a>
                                </div>
                              </div>
                            )}
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Applied Date</Label>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{formatDate(selectedApp.applied_at)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Social Links */}
                          {(selectedApp.linkedin_url || selectedApp.portfolio_url || selectedApp.github_url) && (
                            <div className="pt-2 border-t">
                              <Label className="text-xs text-muted-foreground mb-2 block">Social Links</Label>
                              <div className="flex flex-wrap gap-1">
                                {selectedApp.linkedin_url && (
                                  <a
                                    href={selectedApp.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 transition-colors"
                                  >
                                    <Linkedin className="h-3 w-3" />
                                    LinkedIn
                                  </a>
                                )}
                                {selectedApp.portfolio_url && (
                                  <a
                                    href={selectedApp.portfolio_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs hover:bg-purple-100 transition-colors"
                                  >
                                    <Globe className="h-3 w-3" />
                                    Portfolio
                                  </a>
                                )}
                                {selectedApp.github_url && (
                                  <a
                                    href={selectedApp.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs hover:bg-gray-100 transition-colors"
                                  >
                                    <Github className="h-3 w-3" />
                                    GitHub
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Position Info Card - Small */}
                      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm md:col-span-4">
                        <div className="px-6">
                          <h3 className="text-base font-semibold mb-4">Position Details</h3>
                        </div>
                        <div className="px-6 space-y-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Applied Position</Label>
                            <p className="font-medium text-sm truncate">{selectedApp.position?.title || "Unknown Position"}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Current Status</Label>
                            <Badge className={statusColors[selectedApp.status]} variant="secondary">
                              {statusLabels[selectedApp.status]}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Last Activity</Label>
                            <p className="text-xs text-muted-foreground">{formatDate(selectedApp.last_activity_at)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Cover Letter Card - Full Width */}
                      {selectedApp.cover_letter && (
                        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm md:col-span-12">
                          <div className="px-6">
                            <div className="flex items-center gap-2 mb-4">
                              <MessageSquare className="h-4 w-4" />
                              <h3 className="text-base font-semibold">Cover Letter</h3>
                            </div>
                          </div>
                          <div className="px-6">
                            <div className="bg-muted/50 p-3 rounded-lg border-l-4 border-primary/20">
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {selectedApp.cover_letter}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Documents Card - Compact */}
                      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm md:col-span-6">
                        <div className="px-6">
                          <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-4 w-4" />
                            <h3 className="text-base font-semibold">Documents</h3>
                          </div>
                        </div>
                        <div className="px-6">
                          {selectedApp.resume_url || selectedApp.additional_documents?.length ? (
                            <div className="space-y-1">
                              {selectedApp.resume_url && (
                                <div className="flex items-center justify-between p-2 bg-muted/50 rounded hover:bg-muted/70 transition-colors">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-3 w-3 text-primary" />
                                    <span className="text-sm font-medium">Resume/CV</span>
                                  </div>
                                  <Button size="sm" variant="outline" asChild className="h-6 text-xs">
                                    <a href={selectedApp.resume_url} target="_blank" rel="noopener noreferrer">
                                      View
                                    </a>
                                  </Button>
                                </div>
                              )}
                              {selectedApp.additional_documents?.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded hover:bg-muted/70 transition-colors">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-3 w-3 text-primary" />
                                    <span className="text-sm font-medium truncate">{doc.name}</span>
                                  </div>
                                  <Button size="sm" variant="outline" asChild className="h-6 text-xs">
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                      View
                                    </a>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No documents uploaded</p>
                          )}
                        </div>
                      </div>

                      {/* Status Update Card - Compact */}
                      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm md:col-span-6">
                        <div className="px-6">
                          <h3 className="text-base font-semibold mb-4">Update Status</h3>
                        </div>
                        <div className="px-6 space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="status" className="text-sm">Status</Label>
                            <Select
                              value={statusUpdate.status}
                              onValueChange={(value) =>
                                setStatusUpdate({ ...statusUpdate, status: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="submitted">Submitted</SelectItem>
                                <SelectItem value="reviewing">Under Review</SelectItem>
                                <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                                <SelectItem value="interview_completed">Interview Completed</SelectItem>
                                <SelectItem value="offered">Offer Extended</SelectItem>
                                <SelectItem value="accepted">Offer Accepted</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="withdrawn">Withdrawn</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="notes" className="text-sm">Notes</Label>
                            <Textarea
                              id="notes"
                              value={statusUpdate.notes}
                              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                setStatusUpdate({
                                  ...statusUpdate,
                                  notes: e.target.value,
                                })
                              }
                              placeholder="Add notes about this status update..."
                              rows={2}
                              className="resize-none text-sm"
                            />
                          </div>
                          <Button
                            onClick={handleStatusUpdate}
                            disabled={
                              !statusUpdate.status ||
                              statusUpdate.status === selectedApp?.status
                            }
                            className="w-full h-8 text-sm"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Update Status
                          </Button>
                        </div>
                      </div>

                      {/* Current Notes Card - Full Width */}
                      {selectedApp.notes && (
                        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm md:col-span-12">
                          <div className="px-6">
                            <h3 className="text-base font-semibold mb-4">Current Notes</h3>
                          </div>
                          <div className="px-6">
                            <div className="bg-muted/50 p-3 rounded-lg border-l-4 border-muted-foreground/20">
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {selectedApp.notes}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end p-4 border-t bg-muted/20 flex-shrink-0">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

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
