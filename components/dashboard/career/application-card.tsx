"use client";

import { CareerApplication } from "@/lib/services/career";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
          className="text-xs h-5 px-1.5 opacity-70 group-hover:opacity-100 transition-opacity"
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
          onClick={() => onQuickStatusUpdate(application.id, "interview_scheduled")}
          className="text-xs h-5 px-1.5 opacity-70 group-hover:opacity-100 transition-opacity"
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
          onClick={() => onQuickStatusUpdate(application.id, "offered")}
          className="text-xs h-5 px-1.5 opacity-70 group-hover:opacity-100 transition-opacity"
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
          onClick={() => onQuickStatusUpdate(application.id, "accepted")}
          className="text-xs h-5 px-1.5 opacity-70 group-hover:opacity-100 transition-opacity"
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
          onClick={() => onQuickStatusUpdate(application.id, "rejected")}
          className="text-xs h-5 px-1.5 text-destructive hover:text-destructive opacity-70 group-hover:opacity-100 transition-opacity"
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
          onClick={() => onDeleteApplication(application)}
          className="text-xs h-5 px-1.5 opacity-70 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Delete
        </Button>
      );
    }

    return actions;
  };  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-l-4 border-l-primary/20 hover:border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Avatar and Basic Info */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center ring-2 ring-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                  {application.first_name} {application.last_name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${statusColors[application.status]} text-xs px-2 py-0.5`} variant="secondary">
                    {statusLabels[application.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Applied {formatDate(application.applied_at)}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-1 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(application)}
                  className="text-xs h-6 px-2 opacity-70 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Details
                </Button>
                <div className="flex flex-wrap gap-0.5">
                  {getQuickActions(application)}
                </div>
              </div>
            </div>

            {/* Contact and Position Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-primary/70 flex-shrink-0" />
                  <a href={`mailto:${application.email}`} className="text-primary hover:underline truncate">
                    {application.email}
                  </a>
                </div>
                {application.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-primary/70 flex-shrink-0" />
                    <a href={`tel:${application.phone}`} className="text-primary hover:underline">
                      {application.phone}
                    </a>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-muted-foreground">Position:</span>
                  <span className="truncate text-foreground">{application.position?.title || "Unknown Position"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Cover Letter Preview */}
      {application.cover_letter && (
        <CardContent className="pt-0 pb-3">
          <div className="bg-muted/30 rounded-lg p-2 border-l-2 border-primary/20">
            <p className="text-xs font-medium text-muted-foreground mb-1">Cover Letter</p>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {application.cover_letter}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
