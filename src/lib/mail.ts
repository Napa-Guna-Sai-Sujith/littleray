import nodemailer from "nodemailer";

// Read from environment variables, fallback to a pre-created static Ethereal account for instant out-of-the-box sending
const host = process.env.EMAIL_HOST || "smtp.ethereal.email";
const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587;
const secure = process.env.EMAIL_SECURE === "true";
const user = process.env.EMAIL_USER || "igfm3zmkd5mlnbj4@ethereal.email";
const pass = process.env.EMAIL_PASS || "FJpMqeN3UC9yzU36hu";

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  console.log(`[Email Service] Attempting to send email to: ${to} (Subject: ${subject})`);
  
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: secure,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Little Ray Interio" <${user}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`[Email Service] Email sent successfully: ${info.messageId}`);
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email Service] Preview URL: ${previewUrl}`);
    }

    return info;
  } catch (err: any) {
    console.error(`[Email Service Error] Failed to send email to ${to}:`, err.message);
    // Graceful fallback to console print if SMTP fails completely
    console.warn(
      `[Email Service Fallback] Simulating email details:\n` +
      `---------------------------------------\n` +
      `TO: ${to}\n` +
      `SUBJECT: ${subject}\n` +
      `BODY:\n${text}\n` +
      `---------------------------------------`
    );
    return { simulated: true, error: err.message };
  }
}
