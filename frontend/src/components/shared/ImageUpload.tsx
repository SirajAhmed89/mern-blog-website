/**
 * ImageUpload – shared reusable component for uploading images.
 *
 * Supports:
 *  - Drag & drop
 *  - Click to browse
 *  - URL input fallback
 *  - Preview
 *  - Remove / replace
 *
 * Usage:
 *   <ImageUpload
 *     value={form.featuredImage}
 *     onChange={(url) => set('featuredImage', url)}
 *     folder="blog"
 *     label="Featured Image"
 *   />
 */

import { useRef, useState, useCallback } from 'react';
import { uploadService, type UploadFolder } from '../../services/uploadService';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: UploadFolder;
  label?: string;
  hint?: string;
  /** Max file size in MB (default 10) */
  maxSizeMB?: number;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'misc',
  label = 'Image',
  hint,
  maxSizeMB = 10,
  className = '',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');

  const resolvedSrc = value ? uploadService.resolveUrl(value) : '';
  
  console.log('[ImageUpload]:', {
    value,
    resolvedSrc,
    hasValue: !!value,
    hasResolvedSrc: !!resolvedSrc
  });

  const handleFile = useCallback(
    async (file: File) => {
      setError('');

      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be under ${maxSizeMB} MB.`);
        return;
      }

      setIsUploading(true);
      try {
        const result = await uploadService.uploadImage(file, folder);
        console.log('Upload result:', result);
        onChange(result.url);
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || err?.message || 'Upload failed. Please try again.';
        console.error('Upload error:', err);
        setError(errorMsg);
      } finally {
        setIsUploading(false);
      }
    },
    [folder, maxSizeMB, onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleUrlSubmit = () => {
    if (urlValue.trim()) {
      onChange(urlValue.trim());
      setUrlValue('');
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700">{label}</label>
      )}

      {/* Preview */}
      {resolvedSrc ? (
        <div className="relative group rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50">
          <img
            src={resolvedSrc}
            alt="Preview"
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23e5e7eb"/%3E%3Ctext x="50" y="55" text-anchor="middle" fill="%239ca3af" font-size="12"%3ENo image%3C/text%3E%3C/svg%3E';
            }}
          />
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-neutral-900 text-xs font-medium rounded-md hover:bg-neutral-100 transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-error-500 text-white text-xs font-medium rounded-md hover:bg-error-600 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 h-40 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary-400 bg-primary-50'
              : 'border-neutral-300 bg-neutral-50 hover:border-primary-400 hover:bg-primary-50/30'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-neutral-500">Uploading…</span>
            </div>
          ) : (
            <>
              <svg
                className="w-10 h-10 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="text-center">
                <p className="text-sm font-medium text-neutral-700">
                  Drop image here or{' '}
                  <span className="text-primary-600 underline">browse</span>
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {hint || `JPG, PNG, WebP, GIF up to ${maxSizeMB} MB`}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* URL input toggle */}
      {!resolvedSrc && (
        <div>
          {showUrlInput ? (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                placeholder="https://example.com/image.jpg"
                className="flex-1 h-9 px-3 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-3 h-9 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                Use URL
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="px-3 h-9 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="text-xs text-neutral-500 hover:text-primary-600 underline transition-colors"
            >
              Or enter image URL instead
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-xs text-error-500">{error}</p>}
    </div>
  );
}
