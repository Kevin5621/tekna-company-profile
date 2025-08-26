import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="text-center border-none shadow-lg">
          <CardContent className="pt-12 pb-8">
            {/* Loading Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Memuat...
              </h2>
              <p className="text-sm text-muted-foreground">
                Mohon tunggu sebentar
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full bg-muted rounded-full h-1">
                <div className="bg-primary h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
