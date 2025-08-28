import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function CareerNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">
            Career Position Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            The career position you're looking for doesn't exist or may have been removed.
            Please check the URL or browse our available positions.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/career">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse All Careers
              </Link>
            </Button>
            
            <Button asChild className="w-full" variant="ghost">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
