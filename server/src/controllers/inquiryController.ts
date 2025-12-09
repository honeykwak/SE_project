import { Request, Response } from 'express';
import Inquiry from '../models/Inquiry';
import User from '../models/User';
import { sendEmail } from '../services/emailService';

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

// @desc    Reply to an inquiry via Email
// @route   POST /api/inquiries/:id/reply
// @access  Private
export const replyInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      res.status(404).json({ message: 'Inquiry not found' });
      return;
    }

    if (inquiry.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("CRITICAL: Missing Resend API Key");
      throw new Error("Server Email configuration is missing");
    }

    const emailSubject = `Re: [SyncUp] ${inquiry.senderName}님의 문의에 대한 답변입니다.`;
    const emailContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">SyncUp 메시지가 도착했습니다.</h2>
        <p>안녕하세요, <strong>${inquiry.senderName}</strong>님.</p>
        <p>문의주신 내용에 대해 프리랜서로부터 답변이 도착했습니다.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">본 메일은 발신 전용입니다.</p>
      </div>
    `;

    console.log(`Sending email to ${inquiry.senderEmail}...`);
    await sendEmail(inquiry.senderEmail, emailSubject, emailContent);
    console.log('Email sent successfully');

    res.json({ message: 'Email sent successfully' });
  } catch (error: any) {
    console.error("Reply Error Details:", {
      message: error.message,
      stack: error.stack,
      resendKey: process.env.RESEND_API_KEY ? 'Set' : 'Missing'
    });
    res.status(500).json({ message: error.message || 'Failed to send email' });
  }
};
