"use client";

import { Button } from "@/components/ui/button";
import { IconShare3 } from "@tabler/icons-react";

interface ShareButtonProps {
  readonly title: string;
  readonly text?: string;
  readonly url?: string;
  readonly className?: string;
  readonly variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  readonly size?: "default" | "sm" | "lg" | "icon";
}

export function ShareButton({
  title,
  text = "",
  url,
  className,
  variant = "ghost",
  size = "sm",
}: ShareButtonProps) {
  const handleShare = async () => {
    // Use current URL if not provided
    const shareUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");

    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
        // Fallback to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareUrl);
          // You could add a toast notification here
        }
      }
    } else if (typeof window !== "undefined" && navigator.clipboard) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        // You could add a toast notification here
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={className}
    >
      <IconShare3 className="h-4 w-4" />
      Share
    </Button>
  );
}
