"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="text-center border-none shadow-lg">
          <CardContent className="pt-12 pb-8">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-8xl md:text-9xl font-bold text-primary/20 leading-none">
                404
              </h1>
            </div>

            {/* Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="mb-8 space-y-4">
              <CardTitle className="text-2xl md:text-3xl font-semibold text-foreground">
                Page Not Found
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
                Sorry, the page you are looking for cannot be found. The page may have been moved or the URL is incorrect.
              </CardDescription>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Page
              </Button>
            </div>

            {/* Additional Links */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Or visit other pages:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/blog">Blog</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/career">Career</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/#projects">Projects</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/#testimonials">Testimonials</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
