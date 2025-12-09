import { Request, Response } from 'express';
import Inquiry from '../models/Inquiry';
import User from '../models/User';
import { sendEmail } from '../services/emailService';

// ... (existing code for createInquiry, getInquiries, markAsRead)

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

    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.error("CRITICAL: Missing SMTP Environment Variables");
      throw new Error("Server SMTP configuration is missing");
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
      smtpUser: process.env.SMTP_EMAIL ? 'Set' : 'Missing'
    });
    res.status(500).json({ message: error.message || 'Failed to send email' });
  }
};
