"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

export function ShareButton({
  url,
  title,
  description = "",
  className = "",
  variant = "outline",
  size = "sm",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const shareData = {
    title,
    text: description,
    url,
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
  };

  const handleNativeShare = async () => {
    if (isBrowser && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    }
  };

  const handleCopyLink = async () => {
    if (!isBrowser) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleSocialShare = (platform: "twitter" | "facebook" | "linkedin") => {
    if (!isBrowser) return;

    const shareUrl = shareUrls[platform];
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`gap-2 ${className}`}
          aria-label="Share this article"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Native Share (if supported) */}
        {isBrowser && "share" in navigator && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share via...
          </DropdownMenuItem>
        )}

        {/* Social Media Options */}
        <DropdownMenuItem onClick={() => handleSocialShare("twitter")}>
          <Twitter className="mr-2 h-4 w-4 text-blue-500" />
          Share on Twitter
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleSocialShare("facebook")}>
          <Facebook className="mr-2 h-4 w-4 text-blue-600" />
          Share on Facebook
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleSocialShare("linkedin")}>
          <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
          Share on LinkedIn
        </DropdownMenuItem>

        {/* Copy Link */}
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact version for inline use
export function CompactShareButton({ url }: Pick<ShareButtonProps, "url">) {
  const [copied, setCopied] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCopyLink = async () => {
    if (!isBrowser) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopyLink}
      className="h-8 w-8 p-0"
      aria-label="Copy link"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <LinkIcon className="h-4 w-4" />
      )}
    </Button>
  );
}
