import express from 'express';
import { getHealth, getDatabaseInfo } from '../controllers/healthController.js';

const router = express.Router();

router.get('/', getHealth);
router.get('/database', getDatabaseInfo);

export default router;
