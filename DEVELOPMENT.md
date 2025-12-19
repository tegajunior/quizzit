# 📚 Development Tips & Architecture Guide

## 🏗️ Project Architecture

### Layered Architecture

```
Components Layer (UI)
        ↓
Hooks/Context Layer (State Management)
        ↓
API Routes Layer (Backend)
        ↓
Database Layer (MongoDB)
```

### File Organization Principles

1. **Keep related files together** - All auth components in `components/auth/`
2. **Utilities are reusable** - Put shared logic in `lib/utils/`
3. **Models define structure** - Keep Mongoose schemas in `lib/models/`
4. **API routes handle requests** - One endpoint per `route.ts` file
5. **Context for global state** - Auth state in `lib/context/`

## 🔄 Data Flow

### Registration Flow

```
RegisterForm (Client)
    ↓ (POSTs email, password, etc)
POST /api/auth/register (Server)
    ↓ (Validates with Zod)
    ↓ (Hashes password with bcrypt)
    ↓ (Saves to MongoDB)
    ↓ (Generates verification token)
    ↓ (Sends verification email)
    ↓ (Returns success message)
Redirects to /verify-email
```

### Login Flow

```
LoginForm (Client)
    ↓ (POSTs email, password)
POST /api/auth/login (Server)
    ↓ (Finds user in MongoDB)
    ↓ (Compares password hash)
    ↓ (Generates JWT token)
    ↓ (Sets httpOnly cookie)
    ↓ (Returns user data)
AuthContext updated
Dashboard accessible
```

## 🎯 Key Design Decisions

### 1. httpOnly Cookies for Tokens

Why? Protects against XSS attacks (JavaScript can't access the token)

```tsx
response.cookies.set('authToken', token, {
  httpOnly: true, // ← Can't be accessed by JS
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: 'lax', // CSRF protection
  maxAge: 7 * 24 * 60 * 60, // 7 days
})
```

### 2. Middleware for Route Protection

Why? Centralized security layer, prevents unnecessary API calls

```tsx
// All protected routes checked in one place
const protectedRoutes = ['/dashboard', '/quiz', '/results']
```

### 3. Context API for Auth State

Why? Global state without prop drilling, clean component tree

```tsx
const { user, isAuthenticated } = useAuth()
```

### 4. Zod for Validation

Why? Runtime validation catches errors early, type-safe

```tsx
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
```

## 🔐 Security Best Practices

### ✅ Implemented

1. **Password Hashing** - bcryptjs with 10 salt rounds
2. **CSRF Protection** - SameSite cookie attribute
3. **XSS Protection** - httpOnly cookies
4. **Rate Limiting** - Consider adding with rate-limit package
5. **Input Validation** - Zod schemas on all endpoints
6. **SQL Injection** - Not applicable (using MongoDB with Mongoose)

### 🚀 To Implement Later

1. **Rate Limiting** - Prevent brute force attacks
2. **Email Verification OTP Expiry** - Already implemented (15 mins)
3. **Password Reset** - Setup in phase 2
4. **Two-Factor Authentication** - Enhance security
5. **CORS Configuration** - If API will be called from other domains
6. **Environment Validation** - Ensure all env vars are set on startup

## 📝 Common Development Tasks

### Adding a New API Route

1. Create file: `app/api/feature/route.ts`
2. Export `POST`, `GET`, etc functions
3. Use `connectDB()` to access database
4. Validate input with Zod
5. Handle errors with try-catch
6. Return JSON response with status codes

Example:

```tsx
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await connectDB()

    // Your logic here

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Error message' }, { status: 500 })
  }
}
```

### Adding a New Page

1. Create folder: `app/newfeature/`
2. Create file: `app/newfeature/page.tsx`
3. Optionally protect with middleware
4. Use Chakra UI components for UI
5. Use `useAuth()` if you need user data

Example:

```tsx
'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { Box, Heading } from '@chakra-ui/react'

export default function NewFeaturePage() {
  const { user } = useAuth()
  return <Box>Welcome {user?.firstName}</Box>
}
```

### Adding a New Component

1. Create file: `components/feature/FeatureComponent.tsx`
2. Mark as `'use client'` if it uses hooks
3. Use Chakra UI for styling
4. Accept props for flexibility
5. Use TypeScript interfaces

Example:

```tsx
'use client'

import { Box, Heading } from '@chakra-ui/react'

interface FeatureProps {
  title: string
  data: any[]
}

export function FeatureComponent({ title, data }: FeatureProps) {
  return (
    <Box>
      <Heading>{title}</Heading>
    </Box>
  )
}
```

### Debugging Tips

1. **Check Console Logs**

   ```bash
   # Terminal shows all console.log outputs
   # Browser DevTools shows client-side logs
   ```

2. **Use Middleware Logger** (add to `middleware.ts`)

   ```tsx
   console.log(`[${request.method}] ${pathname}`)
   ```

3. **Database Debugging**

   ```tsx
   // Log what's being saved
   console.log('Saving user:', newUser)
   const saved = await newUser.save()
   console.log('Saved user:', saved)
   ```

4. **API Response Debugging**
   ```bash
   curl -X GET http://localhost:3000/api/auth/me -v
   # Shows headers, cookies, response
   ```

## 📊 Performance Considerations

### Database Queries

```tsx
// ✅ Good - Only select needed fields
const user = await User.findById(id).select('email firstName lastName')

// ❌ Bad - Selects everything including passwords
const user = await User.findById(id)

// Use .select('+password') only when needed
const userWithPassword = await User.findById(id).select('+password')
```

### API Response Sizes

```tsx
// ✅ Good - Minimal response
return NextResponse.json({ id, email }, { status: 200 })

// ❌ Bad - Sends unnecessary data
return NextResponse.json({ user, system, config }, { status: 200 })
```

### Component Optimization

```tsx
// ✅ Good - Memoized to prevent unnecessary re-renders
const Component = React.memo(({ data }: Props) => {
  return <div>{data}</div>
})

// ✅ Good - Lazy loading heavy components
const HeavyComponent = lazy(() => import('./Heavy'))
```

## 🧪 Testing Checklist

### Manual Testing

- [ ] Registration with valid data
- [ ] Registration with invalid email
- [ ] Email verification with valid token
- [ ] Email verification with invalid token
- [ ] Login with correct credentials
- [ ] Login with wrong password
- [ ] Logout clears cookie
- [ ] Protected routes redirect to login
- [ ] Dashboard shows logged-in user info

### Edge Cases

- [ ] Simultaneous registration with same email
- [ ] Expired verification token
- [ ] Very long passwords/emails
- [ ] Special characters in names
- [ ] Rapid repeated login attempts

## 🚀 Deployment Checklist

Before deploying to production:

1. **Environment Variables**

   - [ ] Set strong `JWT_SECRET`
   - [ ] Use production `MONGODB_URI`
   - [ ] Set `NODE_ENV=production`
   - [ ] Configure production email service

2. **Security**

   - [ ] Enable HTTPS only cookies
   - [ ] Add rate limiting
   - [ ] Review all API endpoints
   - [ ] Test authentication flows

3. **Database**

   - [ ] Backup production database
   - [ ] Create database indexes
   - [ ] Test connection string

4. **Monitoring**
   - [ ] Setup error tracking (Sentry, etc)
   - [ ] Monitor API response times
   - [ ] Track failed login attempts

## 📦 Useful npm Commands

```bash
# Development
npm run dev              # Start dev server
npm run lint            # Check for linting errors

# Production
npm run build           # Build for production
npm start              # Start production server

# Database
# (Add if you want to include DB commands)
```

## 🎓 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Chakra UI Docs](https://chakra-ui.com/docs)
- [Mongoose Docs](https://mongoosejs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [JWT Explained](https://jwt.io/introduction)
- [Web Security Academy](https://portswigger.net/web-security)

---

**Happy coding! Remember: Write less, do more! 🚀**
