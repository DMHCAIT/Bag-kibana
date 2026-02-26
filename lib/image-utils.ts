/**
 * Utility functions for handling Supabase Storage image URLs
 */

/**
 * Properly encode Supabase Storage URL
 * Handles spaces and special characters in folder/file names
 */
export function encodeSupabaseUrl(url: string): string {
  if (!url) return '';
  
  try {
    // If URL is already from Supabase
    if (url.includes('supabase.co/storage')) {
      // Split the URL to get the path after 'public/'
      const parts = url.split('/storage/v1/object/public/');
      if (parts.length === 2) {
        const [base, path] = parts;
        
        // Check if URL is already encoded by looking for %20 or other encoded chars
        if (path.includes('%20') || path.includes('%28') || path.includes('%29')) {
          // Already encoded, return as-is
          return url;
        }
        
        // Not encoded, encode each segment
        const segments = path.split('/');
        const encodedSegments = segments.map(segment => 
          encodeURIComponent(segment)
        );
        return `${base}/storage/v1/object/public/${encodedSegments.join('/')}`;
      }
    }
    return url;
  } catch (error) {
    console.error('Error encoding Supabase URL:', error);
    return url;
  }
}

/**
 * Get a fallback image URL
 */
export function getFallbackImage(): string {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239ca3af"%3EImage Not Available%3C/text%3E%3C/svg%3E';
}

/**
 * Handle image load errors by returning fallback
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget;
  if (img.src !== getFallbackImage()) {
    img.src = getFallbackImage();
  }
}
