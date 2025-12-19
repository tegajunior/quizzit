import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Image from 'next/image'
import Link from 'next/link'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Quizzit - Quiz & Exam Platform',
  description:
    'Create and manage online quizzes and exams with webcam proctoring',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b">
          <div className="container border-4 border-amber-600 px-4 py-4">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
            >
              <Image
                src="/logo.svg"
                alt="Quizzit Logo"
                width={40}
                height={40}
                priority
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quizzit
              </span>
            </Link>
          </div>
        </header>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
