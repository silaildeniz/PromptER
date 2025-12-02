/**
 * Image Optimization Utilities
 * Uses Supabase's built-in Image Transformation API
 */

/**
 * Default placeholder image for missing/broken images
 * Using a high-quality placeholder from Unsplash
 */
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=60&fit=crop';

/**
 * Get optimized image URL using Supabase Image Transformation
 * 
 * @param {string} url - Original image URL from Supabase Storage
 * @param {number} width - Desired width in pixels (default: 400)
 * @param {number} quality - Image quality 1-100 (default: 60)
 * @returns {string} Optimized image URL with transformation params
 * 
 * @example
 * // Original: https://xxx.supabase.co/storage/v1/object/public/prompt-assets/image.png
 * // Output:   https://xxx.supabase.co/storage/v1/object/public/prompt-assets/image.png?width=400&quality=60&resize=cover
 */
export const getOptimizedImageUrl = (url, width = 400, quality = 60) => {
  // Return placeholder if URL is missing or invalid
  if (!url || typeof url !== 'string') {
    return PLACEHOLDER_IMAGE;
  }

  // Return placeholder if URL is empty string
  if (url.trim() === '') {
    return PLACEHOLDER_IMAGE;
  }

  // Check if it's a Supabase Storage URL
  const isSupabaseUrl = url.includes('supabase.co/storage/v1/object/public');
  
  if (!isSupabaseUrl) {
    // If it's not a Supabase URL (e.g., external image or Unsplash), return as-is
    return url;
  }

  // Check if URL already has query params
  const hasParams = url.includes('?');
  const separator = hasParams ? '&' : '?';

  // Append Supabase Image Transformation params
  // Docs: https://supabase.com/docs/guides/storage/serving/image-transformations
  return `${url}${separator}width=${width}&quality=${quality}&resize=cover`;
};

/**
 * Get optimized thumbnail for card view
 * Preset for small card images (400px, 60% quality)
 * 
 * @param {string} url - Original image URL
 * @returns {string} Optimized thumbnail URL
 */
export const getCardThumbnail = (url) => {
  return getOptimizedImageUrl(url, 400, 60);
};

/**
 * Get optimized image for detail view
 * Preset for larger detail page images (1200px, 80% quality)
 * 
 * @param {string} url - Original image URL
 * @returns {string} Optimized detail image URL
 */
export const getDetailImage = (url) => {
  return getOptimizedImageUrl(url, 1200, 80);
};

/**
 * Get optimized image for marquee/carousel
 * Preset for medium-sized marquee images (600px, 70% quality)
 * 
 * @param {string} url - Original image URL
 * @returns {string} Optimized marquee image URL
 */
export const getMarqueeImage = (url) => {
  return getOptimizedImageUrl(url, 600, 70);
};

/**
 * Preload an image to improve perceived performance
 * 
 * @param {string} url - Image URL to preload
 * @returns {Promise<void>}
 */
export const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Check if media is a video
 * 
 * @param {string} mediaType - Media type from database
 * @returns {boolean}
 */
export const isVideo = (mediaType) => {
  return mediaType?.toLowerCase() === 'video';
};

/**
 * Get optimized video thumbnail (first frame)
 * Note: Supabase doesn't support video transformation yet,
 * so this returns the original URL
 * 
 * @param {string} url - Original video URL
 * @returns {string} Video URL (unchanged)
 */
export const getVideoThumbnail = (url) => {
  // TODO: When Supabase adds video transformation support, update this
  return url;
};

