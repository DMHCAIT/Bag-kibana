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

  const handleError = () => setImageError(true);
  const imageSrc = imageError ? getFallbackImage() : src;

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
    />
  );
}
