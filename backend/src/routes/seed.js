import express from 'express';
import seedDatabase from '../controllers/seedController.js';

const router = express.Router();

// This endpoint seeds the database with sample data
// WARNING: Only run once!
router.post('/seed', seedDatabase);

export default router;
