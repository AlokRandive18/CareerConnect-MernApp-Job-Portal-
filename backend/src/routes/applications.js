import express from 'express';
import { 
  applyForJob, 
  getMyApplications, 
  getJobApplications,
  updateApplicationStatus 
} from '../controllers/applicationController.js';
import { authenticateToken, authorizeEmployer } from '../middleware/auth.js';

const router = express.Router();

router.post('/:jobId', authenticateToken, applyForJob);
router.get('/', authenticateToken, getMyApplications);
router.get('/job/:jobId', authenticateToken, authorizeEmployer, getJobApplications);
router.put('/:applicationId', authenticateToken, authorizeEmployer, updateApplicationStatus);

export default router;
