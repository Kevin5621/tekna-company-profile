"use client";

import { CareerApplication } from "@/lib/services/career";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Calendar,
  User,
  Trash2,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Clock,
  Briefcase,
} from "lucide-react";

const statusColors = {
  submitted: "bg-info/10 text-info border-info/20",
  reviewing: "bg-warning/10 text-warning border-warning/20",
  interview_scheduled: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  interview_completed: "bg-primary/10 text-primary border-primary/20",
  offered: "bg-success/10 text-success border-success/20",
  accepted: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  withdrawn: "bg-muted text-muted-foreground border-muted",
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

const statusIcons = {
  submitted: Clock,
  reviewing: Eye,
  interview_scheduled: Calendar,
  interview_completed: CheckCircle,
  offered: Briefcase,
  accepted: CheckCircle,
  rejected: XCircle,
  withdrawn: XCircle,
};

interface ApplicationCardProps {
  readonly application: CareerApplication;
  readonly onViewDetails: (application: CareerApplication) => void;
  readonly onQuickStatusUpdate: (applicationId: string, status: CareerApplication["status"]) => void;
  readonly onDeleteApplication: (application: CareerApplication) => void;
}

export default function ApplicationCard({
  application,
  onViewDetails,
  onQuickStatusUpdate,
  onDeleteApplication,
}: ApplicationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
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
          onClick={() => onQuickStatusUpdate(application.id, "reviewing")}
          className="text-xs h-7 px-3 hover:bg-warning/10 hover:border-warning/20 hover:text-warning transition-all duration-200"
        >
          <Eye className="h-3 w-3 mr-1.5" />
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
          onClick={() => onQuickStatusUpdate(application.id, "interview_scheduled")}
          className="text-xs h-7 px-3 hover:bg-secondary/10 hover:border-secondary/20 hover:text-secondary-foreground transition-all duration-200"
        >
          <Calendar className="h-3 w-3 mr-1.5" />
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
          onClick={() => onQuickStatusUpdate(application.id, "offered")}
          className="text-xs h-7 px-3 hover:bg-success/10 hover:border-success/20 hover:text-success transition-all duration-200"
        >
          <CheckCircle className="h-3 w-3 mr-1.5" />
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
          onClick={() => onQuickStatusUpdate(application.id, "accepted")}
          className="text-xs h-7 px-3 hover:bg-success/10 hover:border-success/20 hover:text-success transition-all duration-200"
        >
          <CheckCircle className="h-3 w-3 mr-1.5" />
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
          onClick={() => onQuickStatusUpdate(application.id, "rejected")}
          className="text-xs h-7 px-3 text-destructive hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-all duration-200"
        >
          <XCircle className="h-3 w-3 mr-1.5" />
          Reject
        </Button>
      );
    }

    if (application.status === "rejected") {
      actions.push(
        <Button
          key="delete"
          size="sm"
          variant="outline"
          onClick={() => onDeleteApplication(application)}
          className="text-xs h-7 px-3 text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all duration-200"
        >
          <Trash2 className="h-3 w-3 mr-1.5" />
          Delete
        </Button>
      );
    }

    return actions;
  };

  const StatusIcon = statusIcons[application.status];

  return (
    <Card className="group hover:shadow-lg hover:shadow-muted transition-all duration-300 border-0 bg-card hover:bg-muted/30 p-0 overflow-hidden">
      {/* Status indicator bar */}
      <div className={`h-1 w-full ${statusColors[application.status].split(' ')[0]}`} />
      
      <div className="p-5">
        {/* Header section */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            
            {/* Name and status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-semibold text-foreground truncate group-hover:text-muted-foreground transition-colors">
                  {application.first_name} {application.last_name}
                </h3>
                <Badge 
                  className={`${statusColors[application.status]} text-xs px-2.5 py-1 font-medium border flex items-center gap-1.5`} 
                  variant="secondary"
                >
                  <StatusIcon className="h-3 w-3" />
                  {statusLabels[application.status]}
                </Badge>
              </div>
              
              {/* Contact info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground/60" />
                  <a 
                    href={`mailto:${application.email}`} 
                    className="hover:text-primary hover:underline transition-colors truncate max-w-[200px]"
                  >
                    {application.email}
                  </a>
                </div>
                {application.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <a 
                      href={`tel:${application.phone}`} 
                      className="hover:text-primary hover:underline transition-colors"
                    >
                      {application.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewDetails(application)}
              className="text-sm h-8 px-3 hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              View Details
            </Button>
          </div>
        </div>

        {/* Position and date info */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground/60" />
            <span className="font-medium">Position:</span>
            <span className="text-foreground">{application.position?.title || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground/60" />
            <span className="font-medium">Applied:</span>
            <span className="text-foreground">{formatDate(application.applied_at)}</span>
            <span className="text-muted-foreground/60">at {formatTime(application.applied_at)}</span>
          </div>
        </div>

        {/* Cover letter preview */}
        {application.cover_letter && (
          <div className="mb-4 p-3 bg-muted rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cover Letter Preview</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {application.cover_letter}
            </p>
          </div>
        )}

        {/* Quick actions */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mr-2">Quick Actions:</span>
          <div className="flex flex-wrap gap-2">
            {getQuickActions(application)}
          </div>
        </div>
      </div>
    </Card>
  );
}