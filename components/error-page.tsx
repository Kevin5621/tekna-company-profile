"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

export function ErrorPage({
  error,
  reset,
  title = "An Error Occurred",
  description = "Sorry, an unexpected error occurred. Please try again or go back to the previous page.",
  showBackButton = true,
  backButtonText = "Back",
  backButtonHref,
}: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Route error:", error);
  }, [error]);

  const handleBack = () => {
    if (backButtonHref) {
      window.location.href = backButtonHref;
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="text-center border-destructive/20 shadow-lg">
          <CardContent className="pt-8 pb-6">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="w-12 h-12 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
            </div>

            {/* Content */}
            <div className="mb-6 space-y-3">
              <CardTitle className="text-xl md:text-2xl font-semibold text-foreground">
                {title}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
                {description}
              </CardDescription>
            </div>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 p-3 bg-muted rounded-lg text-left">
                <p className="text-xs font-mono text-muted-foreground break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                onClick={reset}
                size="default"
                className="w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              {showBackButton && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleBack}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {backButtonText}
                </Button>
              )}

              <Button
                variant="ghost"
                size="default"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RouteError(
  props: Omit<ErrorPageProps, "title" | "description">
) {
  return (
    <ErrorPage
      {...props}
      title="An Error Occurred"
      description="Sorry, an error occurred on this page. Please try again or go back to the previous page."
    />
  );
}
