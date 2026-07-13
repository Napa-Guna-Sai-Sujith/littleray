import nodemailer from "nodemailer";

const host = process.env.EMAIL_HOST;
const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587;
const secure = process.env.EMAIL_SECURE === "true";
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

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
  
  if (!host || !user || !pass) {
    console.warn(
      `[Email Service Warning] Email environment variables are missing (EMAIL_HOST, EMAIL_USER, EMAIL_PASS). ` +
      `Simulating email output to console:\n` +
      `---------------------------------------\n` +
      `TO: ${to}\n` +
      `SUBJECT: ${subject}\n` +
      `BODY:\n${text}\n` +
      `---------------------------------------`
    );
    return { simulated: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
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
  return info;
}
