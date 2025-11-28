import nodeMailer from "nodemailer"

import fs from "fs";

// Helper function to send email with retry logic
const sendEmailWithRetry = async (transporter, options, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await transporter.sendMail(options);
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
    // Use Brevo SMTP for production reliability
    const isProduction = process.env.NODE_ENV === 'production';
    
    let transporter;
    const options = {
        from: `"Matty AI" <${process.env.SMTP_MAIL}>`,
        to: email,
        subject,
        html: message,
        headers: {
            "X-Priority": "3",
            "X-Mailer": "Nodemailer",
            "List-Unsubscribe": `<mailto:${process.env.SMTP_MAIL}>`,
        },
    };

    try {
        if (isProduction && process.env.BREVO_SMTP_KEY) {
            // Use Brevo for production (more reliable on Render)
            transporter = nodeMailer.createTransport({
                host: "smtp-relay.brevo.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_MAIL,
                    pass: process.env.BREVO_SMTP_KEY,
                },
                connectionTimeout: 10000,
                socketTimeout: 10000,
            });
            console.log("📧 Using Brevo SMTP for email delivery (production)");
        } else {
            // Use Gmail for development
            transporter = nodeMailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: true,
                auth: {
                    user: process.env.SMTP_MAIL,
                    pass: process.env.SMTP_PASSWORD,
                },
                connectionTimeout: 5000,
                socketTimeout: 5000,
            });
            console.log("📧 Using Gmail SMTP for email delivery (development)");
        }

        // Send email with retry logic
        await sendEmailWithRetry(transporter, options);
        console.log(`✅ Email sent successfully to ${email}`);

    } catch (error) {
        console.error("❌ Error sending email:", error.message || error);
        throw new Error(`Failed to send email: ${error.message || "Unknown error"}`);
    }
}
