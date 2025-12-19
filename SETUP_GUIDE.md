# 🎯 Quizzit - Online Quiz & Exam Platform

A fullstack Next.js application for creating and managing online quizzes and exams with webcam proctoring, real-time results, and comprehensive analytics.

## 🚀 Features

- ✅ **User Authentication** - Email verification, JWT tokens, secure password hashing
- 📝 **Quiz Creation** - Create multiple-choice questions with customizable settings
- 🎥 **Webcam Proctoring** - Automatic student video recording to prevent cheating
- ⏱️ **Timed Assessments** - Set custom time limits with auto-submit
- 📊 **Real-time Results** - Instant scoring and detailed analytics
- 👥 **Student Management** - Manage students, send invite links, track participation
- 🔐 **Secure & Reliable** - Enterprise-grade security with encryption
- 📱 **Responsive Design** - Beautiful UI with Chakra UI and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Chakra UI, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer
- **Validation**: Zod
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)
- Gmail account or SMTP email service (for email verification)

## ⚙️ Installation & Setup

### 1. Clone or create the project

```bash
cd c:\Users\7420\Desktop\Nextjs-Apps\quizzit
```

### 2. Install dependencies

Dependencies are already installed, but you can update them:

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quizzit

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# Email Configuration (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Create a database user
5. Whitelist your IP address
6. Copy the connection string and add it to `.env.local`

### 5. Gmail App Password Setup (for email verification)

1. Enable 2-Factor Authentication on your Google account
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Create an App Password for "Mail" and "Windows"
4. Copy the generated password to `EMAIL_PASSWORD` in `.env.local`

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
quizzit/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── register/route.ts      # Registration endpoint
│   │       ├── login/route.ts         # Login endpoint
│   │       ├── verify-email/route.ts  # Email verification
│   │       ├── logout/route.ts        # Logout endpoint
│   │       └── me/route.ts            # Get current user
│   ├── (pages)
│   │   ├── register/page.tsx          # Registration page
│   │   ├── login/page.tsx             # Login page
│   │   ├── verify-email/page.tsx      # Email verification page
│   │   └── dashboard/page.tsx         # Dashboard page
│   ├── layout.tsx                     # Root layout with Chakra UI
│   ├── page.tsx                       # Landing page
│   └── providers.tsx                  # App providers (Chakra UI, Auth)
├── components/
│   └── auth/
│       ├── RegisterForm.tsx           # Registration form component
│       ├── LoginForm.tsx              # Login form component
│       └── VerifyEmailComponent.tsx   # Email verification component
├── lib/
│   ├── db/
│   │   └── mongodb.ts                 # MongoDB connection
│   ├── models/
│   │   └── User.ts                    # User schema
│   ├── utils/
│   │   ├── auth.ts                    # Auth utilities (JWT, bcrypt)
│   │   └── email.ts                   # Email sending utilities
│   └── context/
│       └── AuthContext.tsx            # Auth context & hooks
├── middleware.ts                      # Route protection middleware
├── .env.local                         # Environment variables (create this)
└── package.json
```

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-email` - Verify email with token
- `GET /api/auth/verify-email?token=xxx` - Check token validity
- `GET /api/auth/me` - Get current authenticated user

### Request/Response Examples

#### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "organizationName": "My School",
  "phone": "+1234567890",
  "role": "user"
}
```

#### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## 🎨 User Roles

- **Admin** - Create quizzes, manage students, view analytics
- **User** - Organization/Educator - Same as admin
- **Student** - Take quizzes, view personal results

## 🔒 Authentication Flow

1. User registers with email → OTP/link sent via email
2. User verifies email → JWT token generated
3. User logs in → JWT token stored in httpOnly cookie
4. Protected routes check for valid JWT token
5. User logs out → Token cleared from cookie

## 🚀 Next Steps

The authentication system is now ready! Next features to implement:

1. **Quiz Management**

   - Create/edit/delete quizzes
   - Add MCQ questions
   - Set time limits and passing scores

2. **Student Management**

   - Create student lists
   - Send invite links
   - Track enrollment

3. **Webcam Proctoring**

   - Start recording when quiz begins
   - Detect suspicious behavior
   - Store recordings in cloud storage

4. **Results & Analytics**

   - Real-time results dashboard
   - Detailed performance metrics
   - Export results

5. **Notifications**
   - Email notifications for quiz completion
   - Admin alerts
   - Student reminders

## 🐛 Troubleshooting

### Email not sending?

- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env.local`
- Ensure Gmail 2FA is enabled and app password is created
- Check spam folder for verification emails

### MongoDB connection failing?

- Verify `MONGODB_URI` is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure MongoDB user has correct permissions

### Login not working after registration?

- Make sure you verified your email first
- Check browser console for errors
- Clear cookies and try again

## 📝 License

This project is licensed under the MIT License.

## 🤝 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using Next.js, TypeScript, and Chakra UI**
