/**
 * Utility functions for processing images in HTML content
 */

import { uploadService } from '../services/uploadService';

/**
 * Process HTML content and resolve all image URLs to absolute URLs.
 * This ensures images display correctly even if they were saved with relative paths.
 * 
 * @param html - HTML content with potentially relative image URLs
 * @returns HTML content with all image URLs resolved to absolute URLs
 */
export function resolveImagesInHtml(html: string): string {
  if (!html) return '';
  
  try {
    // Use regex to find and replace image src attributes
    // This is safer than DOM manipulation and works in all environments
    return html.replace(
      /<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi,
      (_match, before, src, after) => {
        const resolvedSrc = uploadService.resolveUrl(src);
        return `<img${before}src="${resolvedSrc}"${after}>`;
      }
    );
  } catch (error) {
    console.error('Error resolving images in HTML:', error);
    return html; // Return original HTML if processing fails
  }
}

/**
 * Extract the first image URL from HTML content (for preview/thumbnail)
 * 
 * @param html - HTML content
 * @returns First image URL found, or null
 */
export function extractFirstImage(html: string): string | null {
  if (!html) return null;
  
  try {
    const match = html.match(/<img[^>]*?src=["']([^"']+)["'][^>]*?>/i);
    if (match && match[1]) {
      return uploadService.resolveUrl(match[1]);
    }
  } catch (error) {
    console.error('Error extracting first image:', error);
  }
  
  return null;
}

/**
 * Count images in HTML content
 * 
 * @param html - HTML content
 * @returns Number of images
 */
export function countImages(html: string): number {
  if (!html) return 0;
  
  try {
    const matches = html.match(/<img[^>]*?>/gi);
    return matches ? matches.length : 0;
  } catch (error) {
    console.error('Error counting images:', error);
    return 0;
  }
}

/**
 * Validate if an image URL is accessible
 * 
 * @param url - Image URL to validate
 * @returns Promise that resolves to true if image is accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout after 5 seconds
    setTimeout(() => resolve(false), 5000);
  });
}
