'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { VStack, Text, Heading, Container, Spinner } from '@chakra-ui/react'
import axios from 'axios'
import { toaster } from '@/lib/toaster'

export default function VerifyEmailComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState<
    'waiting' | 'verifying' | 'success' | 'error'
  >('waiting')

  // Derive email from searchParams instead of storing in state
  const email = searchParams.get('email') || ''

  useEffect(() => {
    // Check if we have a token in URL
    const urlToken = searchParams.get('token')

    if (urlToken) {
      // Auto-verify when token is present in URL
      const verifyToken = async () => {
        setStep('verifying')
        try {
          // Verify the token
          await axios.post('/api/auth/verify-email', {
            token: urlToken,
          })

          setStep('success')
          toaster.success({
            title: 'Email Verified!',
            description: 'Your email has been verified successfully.',
          })

          // Redirect to dashboard
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } catch (error: unknown) {
          setStep('error')
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.error || 'Invalid or expired token'
            : 'Invalid or expired token'
          toaster.error({
            title: 'Verification Failed',
            description: errorMessage,
          })
        }
      }

      verifyToken()
    }
  }, [searchParams, router])

  return (
    <Container
      maxW="md"
      py={{ base: '12', md: '24' }}
    >
      <VStack gap="8">
        {/* Waiting for email click */}
        {step === 'waiting' && (
          <VStack
            gap="4"
            textAlign="center"
          >
            <Heading size="xl">Check Your Email</Heading>
            <Text color="fg.muted">
              {email
                ? `We sent a verification link to ${email}`
                : 'We sent you a verification email'}
            </Text>
            <Text>
              Click the verification link in your email to activate your
              account.
            </Text>
            <Text
              fontSize="sm"
              color="fg.muted"
            >
              Don&apos;t see the email? Check your spam folder.
            </Text>
          </VStack>
        )}

        {/* Verifying Step */}
        {step === 'verifying' && (
          <VStack gap="4">
            <Spinner
              size="lg"
              colorPalette="blue"
            />
            <Text color="fg.muted">Verifying your email...</Text>
          </VStack>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <VStack
            gap="4"
            textAlign="center"
          >
            <Heading
              size="lg"
              colorPalette="green"
            >
              ✅ Email Verified!
            </Heading>
            <Text>Your email has been verified successfully.</Text>
            <Text
              fontSize="sm"
              color="fg.muted"
            >
              Redirecting to dashboard...
            </Text>
            <Spinner
              size="sm"
              colorPalette="blue"
            />
          </VStack>
        )}

        {/* Error Step */}
        {step === 'error' && (
          <VStack
            gap="4"
            textAlign="center"
          >
            <Heading
              size="lg"
              colorPalette="red"
            >
              ❌ Verification Failed
            </Heading>
            <Text>The verification link is invalid or has expired.</Text>
            <Text
              fontSize="sm"
              color="fg.muted"
            >
              Please request a new verification email or contact support.
            </Text>
          </VStack>
        )}
      </VStack>
    </Container>
  )
}
