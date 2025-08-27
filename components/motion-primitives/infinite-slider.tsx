"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useRef, useState } from "react";

interface InfiniteSliderProps {
  children: ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: "left" | "right";
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 24,
  speed = 50,
  speedOnHover,
  direction = "left",
  className,
}: InfiniteSliderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSpeed = isHovered && speedOnHover ? speedOnHover : speed;

  return (
    <div
      ref={containerRef}
      className={cn("flex overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex shrink-0 animate-infinite-scroll"
        style={{
          gap: `${gap}px`,
          animationDuration: `${currentSpeed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {children}
      </div>
      <div
        className="flex shrink-0 animate-infinite-scroll"
        style={{
          gap: `${gap}px`,
          animationDuration: `${currentSpeed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {children}
      </div>
    </div>
  );
}