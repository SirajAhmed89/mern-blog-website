import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';
import { AppError } from '../utils/AppError.js';

/**
 * Build the public URL for an uploaded file.
 * Files are stored under uploads/<folder>/<filename>
 * and served statically at /uploads/<folder>/<filename>.
 */
const buildUrl = (file) => {
  // file.path is like "uploads/blog/image-xxx.jpg"
  // We want "/uploads/blog/image-xxx.jpg"
  return '/' + file.path.replace(/\\/g, '/');
};

// POST /api/upload/image?folder=blog|avatars|categories|misc
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Please upload an image', 400);
  }

  const url = buildUrl(req.file);
  const responseData = {
    url,
    filename: req.file.filename,
    folder: req.file.destination,
    size: req.file.size,
    mimetype: req.file.mimetype,
  };

  console.log('[UploadController] Image uploaded:', responseData);

  ApiResponse.success(
    res,
    responseData,
    'Image uploaded successfully',
    201
  );
});

// POST /api/upload/images?folder=blog|avatars|categories|misc
export const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('Please upload at least one image', 400);
  }

  const images = req.files.map((file) => ({
    url: buildUrl(file),
    filename: file.filename,
    folder: file.destination,
    size: file.size,
    mimetype: file.mimetype,
  }));

  ApiResponse.success(res, { images }, 'Images uploaded successfully', 201);
});
