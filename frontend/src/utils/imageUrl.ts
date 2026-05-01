/**
 * Image URL Utilities
 * Converts relative image URLs to absolute URLs
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_BASE_URL.replace('/api', '');

/**
 * Convert relative image URL to absolute URL
 * @param url - Relative URL like "/uploads/avatars/image-xxx.jpg"
 * @returns Absolute URL like "http://localhost:5000/uploads/avatars/image-xxx.jpg"
 */
export function getImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  // If already absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Convert relative URL to absolute
  return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}
