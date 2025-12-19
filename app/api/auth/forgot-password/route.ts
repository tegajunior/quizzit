import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/models/User'
import { generateVerificationToken } from '@/lib/utils/auth'
import { sendPasswordResetEmail } from '@/lib/utils/email'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = forgotPasswordSchema.parse(body)

    await connectDB()

    // Find user by email
    const user = await User.findOne({ email: validatedData.email })

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json(
        {
          message:
            'If an account exists with this email, you will receive password reset instructions.',
        },
        { status: 200 }
      )
    }

    // Generate reset token (valid for 1 hour)
    const { token, expiry } = generateVerificationToken(60) // 60 minutes

    // Save token to user
    user.resetPasswordToken = token
    user.resetPasswordExpiry = expiry
    await user.save()

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, token, user.firstName)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Password reset instructions have been sent to your email.',
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Forgot password error:', error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}
