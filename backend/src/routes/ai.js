import express from 'express';
import { analyzeResume } from '../controllers/aiController.js';

const router = express.Router();

// POST /api/ai/analyze
router.post('/analyze', analyzeResume);

export default router;
