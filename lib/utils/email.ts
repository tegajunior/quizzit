import nodemailer from 'nodemailer'
import { Resend } from 'resend'

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
const RESEND_API_KEY = process.env.RESEND_API_KEY_CH
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const resend = new Resend(RESEND_API_KEY)

// Create transporter - using Gmail as example
// For production, use your email service (SendGrid, Resend, etc.)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // Check if email credentials are configured
    if (!RESEND_API_KEY || !APP_URL) {
      console.warn(
        '⚠️  Email not configured. Set RESEND_API_KEY and APP_URL in .env.local'
      )
      console.log('Email would be sent to:', options.to)
      console.log('Subject:', options.subject)
      return
    }

    const mailOptions = {
      from: `Quizzit <hello@chidiebereuzoma.dev>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    }

    await resend.emails.send(mailOptions)
    console.log(`✅ Email sent to ${options.to}`)
  } catch (error) {
    console.error('❌ Error sending email:', error)
    throw error
  }
}

// Send verification email with link
export const sendVerificationEmail = async (
  email: string,
  token: string,
  userName: string
): Promise<void> => {
  const verificationLink = `${APP_URL}/verify-email?token=${token}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Quizzit, ${userName}!</h2>
      <p>Please verify your email address to get started.</p>
      <p>Click the button below to verify your email:</p>
      <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #3182ce; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Verify Email
      </a>
      <p>Or copy this link: <a href="${verificationLink}">${verificationLink}</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create this account, please ignore this email.</p>
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ccc;">
      <p style="color: #666; font-size: 12px;">© 2025 Quizzit. All rights reserved.</p>
    </div>
  `

  await sendEmail({
    to: email,
    subject: 'Verify your Quizzit Email',
    html,
  })
}

// Send verification email with OTP
export const sendOTPEmail = async (
  email: string,
  otp: string,
  userName: string
): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Quizzit, ${userName}!</h2>
      <p>Your email verification code is:</p>
      <div style="font-size: 32px; font-weight: bold; color: #3182ce; text-align: center; margin: 20px 0; letter-spacing: 5px;">
        ${otp}
      </div>
      <p>This code will expire in 15 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ccc;">
      <p style="color: #666; font-size: 12px;">© 2025 Quizzit. All rights reserved.</p>
    </div>
  `

  await sendEmail({
    to: email,
    subject: '🔐 Your Quizzit Verification Code',
    html,
  })
}

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  userName: string
): Promise<void> => {
  const resetLink = `${APP_URL}/reset-password?token=${token}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Quizzit Password</h2>
      <p>Hi ${userName},</p>
      <p>We received a request to reset your password. Click the button below to proceed:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #3182ce; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Reset Password
      </a>
      <p>Or copy this link: <a href="${resetLink}">${resetLink}</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ccc;">
      <p style="color: #666; font-size: 12px;">© 2025 Quizzit. All rights reserved.</p>
    </div>
  `

  await sendEmail({
    to: email,
    subject: '🔐 Reset Your Quizzit Password',
    html,
  })
}
