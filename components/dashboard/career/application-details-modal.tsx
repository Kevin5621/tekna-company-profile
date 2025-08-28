"use client";

import { useState } from "react";
import { CareerApplication } from "@/lib/services/career";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileText,
  MessageSquare,
  Calendar,
  User,
  Phone,
  Mail,
  Globe,
  X,
  Github,
  Linkedin,
  CheckCircle,
} from "lucide-react";

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

interface ApplicationDetailsModalProps {
  application: CareerApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (applicationId: string, status: CareerApplication["status"], notes?: string) => Promise<void>;
}

export default function ApplicationDetailsModal({
  application,
  isOpen,
  onClose,
  onStatusUpdate,
}: ApplicationDetailsModalProps) {
  const [statusUpdate, setStatusUpdate] = useState({
    status: application?.status || "",
    notes: "",
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusUpdate = async () => {
    if (!application) return;

    try {
      await onStatusUpdate(
        application.id,
        statusUpdate.status as CareerApplication["status"],
        statusUpdate.notes
      );
      onClose();
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  if (!isOpen || !application) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
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
                {application.first_name} {application.last_name} • {application.position?.title}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Badge className={`${statusColors[application.status]} flex-shrink-0`} variant="secondary">
                {statusLabels[application.status]}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                {/* Hero Card - Full Width */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 md:col-span-12">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            {application.first_name} {application.last_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Applied for {application.position?.title || "Unknown Position"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          <a href={`mailto:${application.email}`} className="text-primary hover:underline">
                            {application.email}
                          </a>
                        </div>
                        {application.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <a href={`tel:${application.phone}`} className="text-primary hover:underline">
                              {application.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${statusColors[application.status]} text-sm px-3 py-1`} variant="secondary">
                        {statusLabels[application.status]}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Applied {formatDate(application.applied_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:col-span-12">
                  <div className="bg-card border rounded-xl p-4 text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-xs text-muted-foreground">Applied</div>
                    <div className="font-semibold text-sm">{formatDate(application.applied_at).split(',')[0]}</div>
                  </div>
                  <div className="bg-card border rounded-xl p-4 text-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-xs text-muted-foreground">Last Activity</div>
                    <div className="font-semibold text-sm">{formatDate(application.last_activity_at).split(',')[0]}</div>
                  </div>
                  <div className="bg-card border rounded-xl p-4 text-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-xs text-muted-foreground">Documents</div>
                    <div className="font-semibold text-sm">
                      {(application.resume_url ? 1 : 0) + (application.additional_documents?.length || 0)}
                    </div>
                  </div>
                  <div className="bg-card border rounded-xl p-4 text-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Globe className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-xs text-muted-foreground">Social Links</div>
                    <div className="font-semibold text-sm">
                      {[application.linkedin_url, application.portfolio_url, application.github_url].filter(Boolean).length}
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:col-span-12">

                  {/* Cover Letter - Large Card */}
                  {application.cover_letter && (
                    <div className="bg-card border rounded-xl p-6 lg:col-span-8">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Cover Letter</h3>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary/30">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {application.cover_letter}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status Update - Compact Card */}
                  <div className="bg-card border rounded-xl p-6 lg:col-span-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Update Status</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                        <Select
                          value={statusUpdate.status}
                          onValueChange={(value) =>
                            setStatusUpdate({ ...statusUpdate, status: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
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
                      <div>
                        <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
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
                          rows={3}
                          className="mt-1 resize-none"
                        />
                      </div>
                      <Button
                        onClick={handleStatusUpdate}
                        disabled={
                          !statusUpdate.status ||
                          statusUpdate.status === application.status
                        }
                        className="w-full"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Update Status
                      </Button>
                    </div>
                  </div>

                  {/* Documents - Medium Card */}
                  <div className="bg-card border rounded-xl p-6 lg:col-span-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Documents</h3>
                    </div>
                    {application.resume_url || application.additional_documents?.length ? (
                      <div className="space-y-3">
                        {application.resume_url && (
                          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">Resume/CV</div>
                                <div className="text-xs text-muted-foreground">Primary document</div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </Button>
                          </div>
                        )}
                        {application.additional_documents?.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-sm truncate">{doc.name}</div>
                                <div className="text-xs text-muted-foreground">Additional document</div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No documents uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Social Links - Medium Card */}
                  <div className="bg-card border rounded-xl p-6 lg:col-span-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Social Links</h3>
                    </div>
                    {(application.linkedin_url || application.portfolio_url || application.github_url) ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {application.linkedin_url && (
                          <a
                            href={application.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <Linkedin className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-blue-900">LinkedIn</div>
                              <div className="text-xs text-blue-700">Professional profile</div>
                            </div>
                          </a>
                        )}
                        {application.portfolio_url && (
                          <a
                            href={application.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                          >
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                              <Globe className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-purple-900">Portfolio</div>
                              <div className="text-xs text-purple-700">Personal website</div>
                            </div>
                          </a>
                        )}
                        {application.github_url && (
                          <a
                            href={application.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                              <Github className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-gray-900">GitHub</div>
                              <div className="text-xs text-gray-700">Code repository</div>
                            </div>
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No social links provided</p>
                      </div>
                    )}
                  </div>

                  {/* Current Notes - Full Width */}
                  {application.notes && (
                    <div className="bg-card border rounded-xl p-6 lg:col-span-12">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Current Notes</h3>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-muted-foreground/30">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {application.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end p-4 border-t bg-muted/20 flex-shrink-0">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
