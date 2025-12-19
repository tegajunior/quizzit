import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'

// Generate JWT token
export const generateToken = (userId: string): string => {
  // Type assertion needed: JWT_EXPIRY can be string from env or default '7d'
  // TypeScript cannot infer that it matches StringValue template literal type
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY as any })
}

// Verify JWT token
export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    return null
  }
}

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Compare password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

// Generate email verification token (random 6-digit OTP or 32-char token)
export const generateVerificationToken = (): {
  token: string
  expiry: Date
} => {
  // For OTP: Math.random().toString().slice(2, 8)
  // For token: crypto.randomBytes(32).toString('hex')
  const token = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  return { token, expiry }
}

// Generate 6-digit OTP
export const generateOTP = (): { otp: string; expiry: Date } => {
  const otp = Math.random().toString().slice(2, 8).padStart(6, '0')
  const expiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  return { otp, expiry }
}
