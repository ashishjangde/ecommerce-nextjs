import nodemailer from "nodemailer";
import { renderVerificationEmail } from "../emails/verificationEmail";

export const sendVerificationEmail = async (email: string, name: string, verificationCode: string) => {
    const htmlContent = renderVerificationEmail(name, verificationCode);
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODE_MAILER_EMAIL, 
            pass: process.env.NODE_MAILER_PASSWORD, 
        },
    });

  

    const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,  
        to: email,
        subject: "NextStore Account Verification",
        html:htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully.");
        return true;
    } catch (error) {
        console.error("Error sending verification email:", error);
        return false;
    }
};