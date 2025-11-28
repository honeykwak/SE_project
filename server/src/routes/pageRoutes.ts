import express from 'express';
import { getPublicPage } from '../controllers/pageController';

const router = express.Router();

router.get('/:username', getPublicPage);

export default router;

