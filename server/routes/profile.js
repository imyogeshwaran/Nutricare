import express from 'express';
import { 
  getProfile, 
  updatePersonalInfo,
  updateMedicalInfo
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user profile
router.get('/', getProfile);

// Update personal information
router.put('/personal', updatePersonalInfo);

// Update medical information
router.put('/medical', updateMedicalInfo);

export default router;