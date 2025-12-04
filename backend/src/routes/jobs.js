import express from 'express';
import { 
  createJob, 
  getJobs, 
  getJob, 
  updateJob, 
  deleteJob,
  getRecommendedJobs 
} from '../controllers/jobController.js';
import { authenticateToken, authorizeEmployer } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/recommendations', authenticateToken, getRecommendedJobs);
router.get('/:id', getJob);
router.post('/', authenticateToken, authorizeEmployer, createJob);
router.put('/:id', authenticateToken, authorizeEmployer, updateJob);
router.delete('/:id', authenticateToken, authorizeEmployer, deleteJob);

export default router;
