import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface SendMailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

/**
 * Send an email via the configured SMTP transport.
 * Falls back to noop if SMTP is not configured in the environment.
 */
export async function sendMail({ to, subject, text, html }: SendMailOptions) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_HOST) {
    console.warn("SMTP not configured; skipping outbound email")
    return
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Authora Notifier" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  })
}