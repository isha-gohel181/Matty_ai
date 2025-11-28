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
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.SMTP_MAIL) {
        throw new Error("SMTP configuration is missing. Please check your .env file.");
    }

    console.log("📧 Using Brevo SMTP for email delivery");

    // Create transporter with Brevo SMTP configuration
    // Using Brevo's SMTP relay which works better on cloud platforms
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587, // Use 587 for TLS (more compatible with cloud platforms)
        secure: false, // false for TLS, true only for 465
        auth: {
            user: process.env.SMTP_USER,  // Use SMTP_USER for authentication
            pass: process.env.SMTP_PASSWORD,
        },
        logger: true, // Enable logging for debugging
        debug: true
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
        console.error("📍 Error code:", error.code);
        console.error("📍 Error response:", error.response);
        const errorMessage = error.message || "Unknown error";
        throw new Error(`Failed to send email: ${errorMessage}`);
    }
}
