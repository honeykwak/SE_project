import express from 'express';
import { createInquiry, getInquiries, markAsRead, replyInquiry } from '../controllers/inquiryController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public: Send inquiry
router.post('/inquiry/:username', createInquiry);

// Private: Manage inquiries
router.get('/inquiries', protect, getInquiries);
router.put('/inquiries/:id/read', protect, markAsRead);
router.post('/inquiries/:id/reply', protect, replyInquiry);

router.post('/inquiries/:id/reply', protect, replyInquiry);

export default router;
