# ⚡ Quick Start Guide - Quizzit Authentication

## 🎯 What's Been Built

Your authentication system is now complete! Here's what's ready to use:

### ✅ Completed Features

1. **User Registration** - Sign up with email verification
2. **Email Verification** - Token-based email confirmation
3. **Secure Login** - JWT-based authentication
4. **Protected Routes** - Middleware to protect dashboard
5. **User Context** - Global auth state management
6. **Beautiful UI** - Chakra UI components with Tailwind CSS
7. **MongoDB Integration** - User data persistence
8. **Security** - Password hashing, secure cookies, CSRF protection

## 🚀 Quick Start (5 minutes)

### Step 1: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Add your MongoDB URI (from MongoDB Atlas):

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quizzit
   JWT_SECRET=change-this-to-a-random-secret-key-in-production
   ```

3. (Optional) For email verification to work, add Gmail credentials:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   ```

### Step 2: Start the Server

```bash
npm run dev
```

Open http://localhost:3000

### Step 3: Test the Authentication

1. **Landing Page** - See the beautiful home page
2. **Sign Up** (http://localhost:3000/register)
   - Create account with any email
   - Submit form
3. **Email Verification** (http://localhost:3000/verify-email)
   - If email is configured, you'll receive verification link
   - If not configured, you'll see the verification page
4. **Login** (http://localhost:3000/login)
   - After verification, log in with your credentials
5. **Dashboard** (http://localhost:3000/dashboard)
   - View authenticated user info

## 📝 Test Accounts

**Admin Account:**

- Email: admin@example.com
- Password: admin123

**Student Account:**

- Email: student@example.com
- Password: student123

(Create these by registering through the UI)

## 🔑 Key Files & What They Do

| File                                 | Purpose                       |
| ------------------------------------ | ----------------------------- |
| `lib/db/mongodb.ts`                  | MongoDB connection management |
| `lib/models/User.ts`                 | User schema & database model  |
| `lib/utils/auth.ts`                  | JWT, bcrypt, token utilities  |
| `lib/utils/email.ts`                 | Email sending functions       |
| `lib/context/AuthContext.tsx`        | Global auth state & hooks     |
| `app/api/auth/register/route.ts`     | Registration API              |
| `app/api/auth/login/route.ts`        | Login API                     |
| `app/api/auth/verify-email/route.ts` | Email verification API        |
| `app/api/auth/me/route.ts`           | Get current user API          |
| `components/auth/RegisterForm.tsx`   | Registration UI component     |
| `components/auth/LoginForm.tsx`      | Login UI component            |
| `middleware.ts`                      | Route protection              |

## 🎨 UI Pages

- `/` - Landing page with features
- `/register` - User registration form
- `/login` - User login form
- `/verify-email` - Email verification page
- `/dashboard` - Protected dashboard (requires login)

## 🔐 Authentication Flow

```
1. User registers
   ↓
2. Email verification link sent
   ↓
3. User clicks link/enters token
   ↓
4. Email marked as verified
   ↓
5. JWT token generated and stored in httpOnly cookie
   ↓
6. User logs in with email/password
   ↓
7. JWT token refreshed, stored in cookie
   ↓
8. Protected routes check for valid JWT
   ↓
9. User logs out → Cookie cleared
```

## 🛠️ Using the Auth Context in Components

```tsx
'use client'

import { useAuth } from '@/lib/context/AuthContext'

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  return (
    <div>
      {isAuthenticated ? (
        <>
          Welcome, {user?.firstName}!<button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  )
}
```

## 📚 API Examples

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: authToken=YOUR_JWT_TOKEN"
```

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"

- Check `MONGODB_URI` in `.env.local`
- Make sure IP is whitelisted in MongoDB Atlas
- Test connection with: `mongosh "your-connection-string"`

### "Email not sending"

- Check `EMAIL_USER` and `EMAIL_PASSWORD`
- For Gmail, create App Password (not regular password)
- Enable 2FA on Google account first
- Verification still works without email setup (manual link entry)

### "Page blank after login"

- Check browser console for errors
- Clear cookies and cache
- Make sure `.env.local` is saved
- Restart dev server: `npm run dev`

### "Stuck on verification page"

- Make sure you registered first
- If no email config, manually enter token from console logs
- Check MongoDB connection

## 📦 Next Steps

Ready to add more features? Here's the recommended order:

### Phase 2: Quiz Management

- Create Quiz model
- Quiz CRUD API routes
- Quiz creation UI

### Phase 3: Questions

- Question model
- Add/edit/delete questions
- Question types (MCQ, T/F, etc)

### Phase 4: Student Management

- Student enrollment
- Send invite links
- Track participation

### Phase 5: Exam Taking

- Quiz interface UI
- Timer functionality
- Auto-save answers

### Phase 6: Webcam Proctoring

- WebRTC integration
- Video recording
- Store in cloud (AWS S3 or similar)

### Phase 7: Results & Analytics

- Results dashboard
- Performance charts
- Export results

## 💡 Pro Tips

1. **Use the Auth Context** - Never check localStorage for tokens, use `useAuth()` hook
2. **Protected Routes** - The middleware automatically redirects unauthenticated users
3. **Environment Variables** - Never commit `.env.local` to git
4. **Testing** - Use Postman or curl to test API endpoints
5. **Dark Mode** - Chakra UI automatically supports dark mode with `useColorMode()`

## 📞 Need Help?

Check the console logs for error messages. Most issues will be logged there!

---

**Happy coding! 🚀**
