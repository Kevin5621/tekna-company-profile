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
import { AlertTriangle, Home, RefreshCw, Mail } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="text-center border-destructive/20 shadow-lg">
          <CardContent className="pt-12 pb-8">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </div>

            {/* Content */}
            <div className="mb-8 space-y-4">
              <CardTitle className="text-2xl md:text-3xl font-semibold text-foreground">
                Terjadi Kesalahan Sistem
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
                Maaf, terjadi kesalahan yang tidak terduga pada sistem kami. Tim
                teknis telah diberitahu dan sedang menangani masalah ini.
              </CardDescription>
            </div>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 p-4 bg-muted rounded-lg text-left">
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={reset} size="lg" className="w-full sm:w-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>

            {/* Contact Information */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Jika masalah berlanjut, silakan hubungi tim support kami:
              </p>
              <Button variant="ghost" size="sm" asChild>
                <a href="mailto:support@tekna.id">
                  <Mail className="w-4 h-4 mr-2" />
                  support@tekna.id
                </a>
              </Button>
            </div>

            {/* Company Info */}
            <div className="mt-6">
              <p className="text-xs text-muted-foreground">
                PT Sapujagat Nirmana Tekna
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
