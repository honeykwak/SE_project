import nodemailer from 'nodemailer';

// Nodemailer Transporter init
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use 'host' and 'port' for generic SMTP
    auth: {
        user: process.env.SMTP_EMAIL, // Your Email
        pass: process.env.SMTP_PASSWORD, // Your App Password
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"SyncUp Notification" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
