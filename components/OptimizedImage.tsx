"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getFallbackImage, encodeSupabaseUrl } from "@/lib/image-utils";

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
  useBlur?: boolean;
  blurDataURL?: string;
}

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
  useBlur = false,
  blurDataURL,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);
  
  // Encode URL properly when component mounts or src changes
  useEffect(() => {
    if (src) {
      const encodedSrc = encodeSupabaseUrl(src);
      setCurrentSrc(encodedSrc);
      setImageError(false);
      setRetryCount(0);
    }
  }, [src]);

  const handleError = () => {
    // Retry once with a delay before showing fallback
    if (retryCount < 1) {
      setTimeout(() => {
        setRetryCount(retryCount + 1);
        setCurrentSrc(encodeSupabaseUrl(src) + '?retry=' + (retryCount + 1));
      }, 1000);
    } else {
      setImageError(true);
    }
  };
  
  const imageSrc = imageError ? getFallbackImage() : currentSrc;

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes || "100vw"}
        priority={priority}
        quality={quality}
        onLoad={onLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        style={style}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        unoptimized={imageError}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      quality={quality}
      onLoad={onLoad}
      onError={handleError}
      loading={priority ? "eager" : "lazy"}
      style={style}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      unoptimized={imageError}
    />
  );
}
