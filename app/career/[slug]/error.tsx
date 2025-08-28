"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CareerDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Career detail error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl text-destructive">
            Something went wrong!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            We encountered an error while loading the career position details.
            Please try again or return to the careers page.
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={reset}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button
              onClick={() => router.push("/career")}
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Careers
            </Button>
            
            <Button
              onClick={() => router.push("/")}
              className="w-full"
              variant="ghost"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
