import express from 'express';
import { 
  getRecommendations, 
  getRecommendationById,
  generateRecommendation
} from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all recommendations for a user
router.get('/', getRecommendations);

// Get a specific recommendation by ID
router.get('/:id', getRecommendationById);

// Generate new recommendation
router.post('/generate', generateRecommendation);

export default router;