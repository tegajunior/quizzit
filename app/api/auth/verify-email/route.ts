import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/models/User'
import { generateToken } from '@/lib/utils/auth'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Find user with matching token and check expiry
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpiry: { $gt: new Date() },
      isEmailVerified: false,
    }).select('+emailVerificationToken +emailVerificationExpiry')

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Mark email as verified and remove token
    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpiry = undefined
    await user.save()

    // Generate JWT token
    const jwtToken = generateToken(user._id.toString())

    // Create response with token in httpOnly cookie
    const response = NextResponse.json(
      {
        message: 'Email verified successfully!',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      { status: 200 }
    )

    // Set httpOnly cookie
    response.cookies.set('authToken', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Email verification failed' },
      { status: 500 }
    )
  }
}

// GET endpoint to check token validity
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpiry: { $gt: new Date() },
      isEmailVerified: false,
    }).select('+emailVerificationToken')

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        valid: true,
        email: user.email,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { error: 'Token validation failed' },
      { status: 500 }
    )
  }
}
