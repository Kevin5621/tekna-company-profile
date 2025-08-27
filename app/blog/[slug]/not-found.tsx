import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-lg mx-auto shadow-xl border-2">
        <CardContent className="p-12 text-center space-y-8">
          {/* Enhanced visual indicator */}
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground">
                404
              </span>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Article Not Found
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                The article you&apos;re looking for doesn&apos;t exist or has
                been moved to a different location.
              </p>
            </div>
          </div>

          {/* Enhanced action buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/blog">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Blog
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </div>

            {/* Additional help */}
            <div className="pt-6 border-t border-muted/50">
              <p className="text-sm text-muted-foreground mb-3">
                Looking for something specific?
              </p>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/blog/search">Search Articles</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
