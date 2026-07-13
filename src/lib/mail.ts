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
  
  let transporter;
  let senderEmail = user;

  if (!host || !user || !pass) {
    console.log("[Email Service] Missing email env variables. Generating Ethereal test account...");
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      senderEmail = testAccount.user;
    } catch (e: any) {
      console.warn("[Email Service] Failed to create Ethereal account, falling back to console log simulation.", e.message);
      console.warn(
        `---------------------------------------\n` +
        `TO: ${to}\n` +
        `SUBJECT: ${subject}\n` +
        `BODY:\n${text}\n` +
        `---------------------------------------`
      );
      return { simulated: true };
    }
  } else {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  const info = await transporter.sendMail({
    from: `"Little Ray Interio" <${senderEmail}>`,
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
}
