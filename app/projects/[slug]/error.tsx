"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Home, RefreshCw, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ProjectDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Project detail error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl text-destructive">
            Project Loading Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            We encountered an error while loading the project details. This might be due to a temporary server issue or network problem.
          </p>
          
          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="p-4 bg-muted rounded-lg text-left">
              <p className="text-sm font-mono text-muted-foreground break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-3">
            <Button
              onClick={reset}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button
              asChild
              className="w-full"
              variant="outline"
            >
              <Link href="/projects">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Link>
            </Button>
            
            <Button
              asChild
              className="w-full"
              variant="ghost"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>

          {/* Additional Help */}
          <div className="pt-4 border-t border-muted/50">
            <p className="text-sm text-muted-foreground text-center mb-3">
              Still having trouble? Check out our other projects:
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Link href="/projects">
                <ExternalLink className="w-4 h-4 mr-2" />
                Browse All Projects
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
