"use client";

import Image from "next/image";
import { useState } from "react";
import { getFallbackImage } from "@/lib/image-utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  onLoad?: () => void;
  style?: React.CSSProperties;
}

/**
 * Optimized image component with:
 * - Instant blur placeholder
 * - Smooth loading transitions
 * - Error handling with fallback
 * - Priority loading support
 */
export default function OptimizedImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  sizes,
  priority = false,
  quality = 85,
  onLoad,
  style,
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const imageSrc = imageError ? getFallbackImage() : src;

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`} style={style}>
      {/* Blur placeholder - shows instantly */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`${className} transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        sizes={sizes}
        priority={priority}
        quality={quality}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}
