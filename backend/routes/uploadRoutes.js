import express from 'express';
import { uploadImage, uploadMultipleImages } from '../controllers/uploadController.js';
import { uploadSingle, uploadMultiple } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - only authenticated users can upload
router.post('/image', protect, uploadSingle, uploadImage);
router.post('/images', protect, uploadMultiple, uploadMultipleImages);

export default router;
