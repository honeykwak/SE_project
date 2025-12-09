import { Resend } from 'resend';

// Initialize Resend with API Key
// Key will be provided by user in .env (RESEND_API_KEY)
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const data = await resend.emails.send({
            from: 'SyncUp <onboarding@resend.dev>', // Free tier must use this domain or verified domain
            to: [to], // Free tier can only send to yourself unless domain is verified, BUT often allows test emails. 
            // User Note: For Resend free tier, you can only send to the email you signed up with (the 'delivered' address), OR you verify a domain.
            // If the freelancer tries to send to a random client email, it might fail in restricted mode.
            // safely, we should warn if it fails. 
            subject: subject,
            html: html,
        });

        console.log('Resend Email Success:', data);
        return data;
    } catch (error) {
        console.error('Resend Email Error:', error);
        throw error;
    }
};
