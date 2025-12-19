import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/models/User'
import { hashPassword, generateVerificationToken } from '@/lib/utils/auth'
import { sendVerificationEmail } from '@/lib/utils/email'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    ),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  organizationName: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['admin', 'user', 'student']).optional().default('user'),
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Generate verification token
    const { token, expiry } = generateVerificationToken()

    // Create new user
    const newUser = new User({
      email: validatedData.email,
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      organizationName: validatedData.organizationName,
      phone: validatedData.phone,
      role: validatedData.role,
      emailVerificationToken: token,
      emailVerificationExpiry: expiry,
      isEmailVerified: false,
    })

    await newUser.save()

    // Send verification email
    try {
      await sendVerificationEmail(
        validatedData.email,
        token,
        validatedData.firstName
      )
    } catch (emailError) {
      console.error('Email sending failed but user registered:', emailError)
      // Don't fail registration if email fails, but log it
    }

    return NextResponse.json(
      {
        message:
          'Registration successful! Please check your email to verify your account.',
        userId: newUser._id,
        email: newUser.email,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Registration error:', error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    // Handle MongoDB duplicate key error
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
