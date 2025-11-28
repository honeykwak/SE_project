import express from 'express';
import {
  getPortfolioItems,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../controllers/portfolioController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // 인증 필요

router.route('/').get(getPortfolioItems).post(createPortfolioItem);
router.route('/:id').put(updatePortfolioItem).delete(deletePortfolioItem);

export default router;

