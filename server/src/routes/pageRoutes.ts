import express from 'express';
import { getPublicPage, incrementVisit } from '../controllers/pageController';

const router = express.Router();

router.get('/:username', getPublicPage);
router.post('/:username/visit', incrementVisit);

export default router;

