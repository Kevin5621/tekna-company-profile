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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  FileText,
  ExternalLink,
  MessageSquare,
  Calendar,
  User,
  Filter,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import BackButton from "@/components/ui/back-button";

const statusColors = {
  submitted: "bg-blue-100 text-blue-800",
  reviewing: "bg-yellow-100 text-yellow-800",
  interview_scheduled: "bg-purple-100 text-purple-800",
  interview_completed: "bg-indigo-100 text-indigo-800",
  offered: "bg-green-100 text-green-800",
  accepted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-800",
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

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<CareerApplication | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    notes: "",
  });

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
    return applications.filter((app) => {
      const matchesStatus =
        filterStatus === "all" || app.status === filterStatus;
      const matchesSearch =
        !searchTerm ||
        app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position?.title.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [applications, filterStatus, searchTerm]);

  const handleViewDetails = (application: CareerApplication) => {
    setSelectedApp(application);
    setStatusUpdate({
      status: application.status,
      notes: "",
    });
    setShowDetails(true);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getApplicationStats = () => {
    const stats = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: applications.length,
      submitted: stats.submitted || 0,
      reviewing: stats.reviewing || 0,
      interview_scheduled: stats.interview_scheduled || 0,
      interview_completed: stats.interview_completed || 0,
      offered: stats.offered || 0,
      accepted: stats.accepted || 0,
      rejected: stats.rejected || 0,
      withdrawn: stats.withdrawn || 0,
    };
  };

  const stats = getApplicationStats();

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
          { label: "Karir", href: "/dashboard/career" },
          { label: "Applications", href: "/dashboard/career/applications" },
          { label: "Daftar Lamaran", isCurrentPage: true },
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/career" label="Kembali ke Career" />
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.submitted}
            </div>
            <p className="text-xs text-muted-foreground">Submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.reviewing}
            </div>
            <p className="text-xs text-muted-foreground">Reviewing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {stats.interview_scheduled}
            </div>
            <p className="text-xs text-muted-foreground">Interview</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.interview_completed}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.offered}
            </div>
            <p className="text-xs text-muted-foreground">Offered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">
              {stats.accepted}
            </div>
            <p className="text-xs text-muted-foreground">Accepted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="reviewing">Under Review</SelectItem>
                  <SelectItem value="interview_scheduled">
                    Interview Scheduled
                  </SelectItem>
                  <SelectItem value="interview_completed">
                    Interview Completed
                  </SelectItem>
                  <SelectItem value="offered">Offer Extended</SelectItem>
                  <SelectItem value="accepted">Offer Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card
            key={application.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-lg">
                      {application.first_name} {application.last_name}
                    </CardTitle>
                    <Badge className={statusColors[application.status]}>
                      {statusLabels[application.status]}
                    </Badge>
                  </div>
                  <CardDescription>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Position:</span>
                        {application.position?.title || "Unknown Position"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Email:</span>
                        {application.email}
                      </div>
                      {application.phone && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Phone:</span>
                          {application.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">
                          Applied: {formatDate(application.applied_at)}
                        </span>
                      </div>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(application)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-3 w-3" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardHeader>
            {application.cover_letter && (
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Cover Letter:</p>
                  <p className="line-clamp-2">{application.cover_letter}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <p className="text-muted-foreground">
                  {searchTerm || filterStatus !== "all"
                    ? "No applications found matching your filters."
                    : "No applications found."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Application Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Application Details: {selectedApp?.first_name}{" "}
              {selectedApp?.last_name}
            </DialogTitle>
            <DialogDescription>
              Applied for {selectedApp?.position?.title} on{" "}
              {selectedApp && formatDate(selectedApp.applied_at)}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <p className="text-sm mt-1">
                      {selectedApp.first_name} {selectedApp.last_name}
                    </p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm mt-1">{selectedApp.email}</p>
                  </div>
                  {selectedApp.phone && (
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm mt-1">{selectedApp.phone}</p>
                    </div>
                  )}
                  {selectedApp.linkedin_url && (
                    <div>
                      <Label>LinkedIn</Label>
                      <a
                        href={selectedApp.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Profile
                      </a>
                    </div>
                  )}
                  {selectedApp.portfolio_url && (
                    <div>
                      <Label>Portfolio</Label>
                      <a
                        href={selectedApp.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Portfolio
                      </a>
                    </div>
                  )}
                  {selectedApp.github_url && (
                    <div>
                      <Label>GitHub</Label>
                      <a
                        href={selectedApp.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View GitHub
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApp.cover_letter && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Cover Letter</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedApp.cover_letter}
                    </p>
                  </div>
                </div>
              )}

              {/* Resume & Documents */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Documents</h3>
                <div className="space-y-2">
                  {selectedApp.resume_url && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <a
                        href={selectedApp.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Resume/CV
                      </a>
                    </div>
                  )}
                  {selectedApp.additional_documents?.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {doc.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Update Status</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
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
                        <SelectItem value="interview_scheduled">
                          Interview Scheduled
                        </SelectItem>
                        <SelectItem value="interview_completed">
                          Interview Completed
                        </SelectItem>
                        <SelectItem value="offered">Offer Extended</SelectItem>
                        <SelectItem value="accepted">Offer Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="withdrawn">Withdrawn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={statusUpdate.notes}
                      onChange={(e) =>
                        setStatusUpdate({
                          ...statusUpdate,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Add notes about this status update..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Current Notes */}
              {selectedApp.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Current Notes</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedApp.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={
                !statusUpdate.status ||
                statusUpdate.status === selectedApp?.status
              }
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
