import nodemailer from "nodemailer";
import fs from "fs";

// Helper function to send email with retry logic
const sendEmailWithRetry = async (sendFn, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await sendFn();
            return true;
        } catch (error) {
            if (i < maxRetries - 1) {
                console.log(`📧 Email send attempt ${i + 1} failed, retrying...`);
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
            } else {
                throw error;
            }
        }
    }
};

export const sendEmail = async ({ email, subject, message }) => {
    // Validate required environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_MAIL || !process.env.SMTP_PASSWORD) {
        throw new Error("SMTP configuration is missing. Please check your .env file.");
    }

    console.log("📧 Using Brevo SMTP for email delivery");

    // Create transporter with Brevo SMTP configuration
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        await sendEmailWithRetry(async () => {
            await transporter.sendMail({
                from: `"Matty AI" <${process.env.SMTP_MAIL}>`,
                to: email,
                subject: subject,
                html: message,
            });
        });

        console.log(`✅ Email sent successfully to ${email}`);

    } catch (error) {
        console.error("❌ Error sending email:", error.message || error);
        const errorMessage = error.message || "Unknown error";
        throw new Error(`Failed to send email: ${errorMessage}`);
    }
}
