/**
 * High-performance Image Optimizer for Muffinns Sweets & Bakers
 * Converts heavy raw images to modern WebP / AVIF, applies CDN dimension resizing,
 * and enables responsive quality optimizations.
 */

interface OptimizeImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'auto' | 'jpg' | 'png';
  blur?: number;
}

/**
 * Transforms an image URL to use CDN-level WebP compression and dimension scaling.
 * Supports ImageKit (ik.imagekit.io), Unsplash, and standard CDNs.
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  options: OptimizeImageOptions = {}
): string {
  if (!url || typeof url !== 'string') {
    return '/assets/images/muffinns_multi_grain_bread.jpg';
  }

  const {
    width = 600,
    quality = 80,
    format = 'auto'
  } = options;

  // Local assets or SVGs don't need CDN transformation
  if (url.startsWith('/assets/') || url.endsWith('.svg') || url.startsWith('data:')) {
    return url;
  }

  try {
    // 1. ImageKit Optimization (Used for Muffinns Bakery photo CDN)
    if (url.includes('ik.imagekit.io')) {
      const urlObj = new URL(url);
      
      // If transformation parameters already exist in query
      const existingTr = urlObj.searchParams.get('tr');
      const trParts: string[] = [];
      
      if (width) trParts.push(`w-${width}`);
      if (options.height) trParts.push(`h-${options.height}`);
      if (quality) trParts.push(`q-${quality}`);
      if (format) trParts.push(`f-${format === 'auto' ? 'webp' : format}`);

      // Apply transformation via query param (cleanest for cached ImageKit URLs)
      urlObj.searchParams.set('tr', trParts.join(','));
      return urlObj.toString();
    }

    // 2. Unsplash Optimization
    if (url.includes('unsplash.com')) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', 'crop');
      if (width) urlObj.searchParams.set('w', String(width));
      if (quality) urlObj.searchParams.set('q', String(quality));
      return urlObj.toString();
    }

    // 3. ImgBB or other external direct image links
    return url;
  } catch {
    // Fallback gracefully if URL parsing fails
    return url;
  }
}

/**
 * Helper to generate responsive srcSet for high-DPI (Retina) displays
 */
export function getResponsiveSrcSet(url: string, baseWidth = 400): string {
  if (!url || !url.includes('ik.imagekit.io')) {
    return '';
  }
  const small = getOptimizedImageUrl(url, { width: baseWidth, quality: 75 });
  const medium = getOptimizedImageUrl(url, { width: baseWidth * 2, quality: 80 });
  return `${small} 1x, ${medium} 2x`;
}
