import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '../utils/AppError.js';

/**
 * Upload folder structure:
 *   uploads/
 *     blog/          ← featured images & inline blog content images
 *     avatars/       ← user profile/avatar images
 *     categories/    ← category cover images
 *     misc/          ← any other uploads
 */

const UPLOAD_DIRS = {
  blog: 'uploads/blog',
  avatars: 'uploads/avatars',
  categories: 'uploads/categories',
  misc: 'uploads/misc',
};

// Ensure all upload directories exist on startup
Object.values(UPLOAD_DIRS).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Resolve destination folder from request.
 * Clients pass ?folder=blog|avatars|categories|misc (defaults to misc).
 */
const resolveDestination = (req) => {
  const folder = req.query?.folder || req.body?.folder || 'misc';
  return UPLOAD_DIRS[folder] ?? UPLOAD_DIRS.misc;
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = resolveDestination(req);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    // fieldname-timestamp-random.ext  e.g. image-1714000000000-123456789.webp
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filter – images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new AppError('Only image files are allowed (jpeg, jpg, png, gif, webp)', 400));
};

// Multer config
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter,
});

// Convenience middleware exports
export const uploadSingle = upload.single('image');
export const uploadMultiple = upload.array('images', 10);
