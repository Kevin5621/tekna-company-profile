"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  readonly src: string | null;
  readonly alt: string;
  readonly fallbackSrc?: string;
  readonly fill?: boolean;
  readonly width?: number;
  readonly height?: number;
  readonly className?: string;
  readonly unoptimized?: boolean;
  readonly priority?: boolean;
  readonly size?: "small" | "medium" | "large";
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  fill = false,
  width,
  height,
  className,
  unoptimized = false,
  priority = false,
  size = "medium",
  ...props
}: ImageWithFallbackProps) {
  // Choose fallback based on size if not provided
  const defaultFallback =
    fallbackSrc ||
    (size === "large"
      ? "/images/placeholder-blog-large.svg"
      : "/images/placeholder-blog.svg");

  const [imageSrc, setImageSrc] = useState(src || defaultFallback);
  const [hasError, setHasError] = useState(!src);

  const handleError = () => {
    if (imageSrc !== defaultFallback) {
      setImageSrc(defaultFallback);
      setHasError(true);
    }
  };

  const imageProps = {
    ...props,
    src: imageSrc,
    alt,
    className: cn(className, hasError && "opacity-75"),
    onError: handleError,
    unoptimized: hasError || unoptimized,
    priority,
  };

  if (fill) {
    return <Image {...imageProps} fill alt={alt} />;
  }

  return <Image {...imageProps} width={width} height={height} alt={alt} />;
}
