import { Request, Response } from 'express';
import Inquiry from '../models/Inquiry';
import User from '../models/User';

// @desc    Send inquiry to user (Public)
// @route   POST /api/inquiry/:username
// @access  Public
export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const { senderName, senderEmail, message } = req.body;

    if (!senderName || !senderEmail || !message) {
      res.status(400).json({ message: 'Please fill in all fields' });
      return;
    }

    const recipient = await User.findOne({ username });
    if (!recipient) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const inquiry = await Inquiry.create({
      user: recipient._id,
      senderName,
      senderEmail,
      message,
    });

    res.status(201).json({ message: 'Inquiry sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get my inquiries (Private)
// @route   GET /api/inquiries
// @access  Private
export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiries = await Inquiry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark inquiry as read
// @route   PUT /api/inquiries/:id/read
// @access  Private
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      res.status(404).json({ message: 'Inquiry not found' });
      return;
    }

    if (inquiry.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    inquiry.isRead = true;
    await inquiry.save();

    res.json(inquiry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

