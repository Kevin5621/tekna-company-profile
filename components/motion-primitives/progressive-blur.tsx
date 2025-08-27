"use client";

import { cn } from "@/lib/utils";

interface ProgressiveBlurProps {
  className?: string;
  direction?: "left" | "right" | "top" | "bottom";
  blurIntensity?: number;
}

export function ProgressiveBlur({
  className,
  direction = "right",
  blurIntensity = 1,
}: ProgressiveBlurProps) {
  const getMask = () => {
    switch (direction) {
      case "left":
        return "linear-gradient(to right, black, transparent)";
      case "right":
        return "linear-gradient(to left, black, transparent)";
      case "top":
        return "linear-gradient(to bottom, black, transparent)";
      case "bottom":
        return "linear-gradient(to top, black, transparent)";
      default:
        return "linear-gradient(to left, black, transparent)";
    }
  };

  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{
        backdropFilter: `blur(${blurIntensity}px)`,
        WebkitMask: getMask(),
        mask: getMask(),
      }}
    />
  );
}