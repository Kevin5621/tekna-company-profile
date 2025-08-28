import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-card/50 backdrop-blur-sm rounded-full">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}
