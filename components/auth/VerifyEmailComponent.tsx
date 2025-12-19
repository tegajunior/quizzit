'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Button,
  VStack,
  Text,
  Heading,
  Container,
  Spinner,
  Input,
} from '@chakra-ui/react'
import { Field } from '@chakra-ui/react/field'
import axios from 'axios'
import { toaster } from '@/lib/toaster'

export default function VerifyEmailComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [token, setToken] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [step, setStep] = useState<'input' | 'verifying' | 'success' | 'error'>(
    'input'
  )

  useEffect(() => {
    // Check if we have a token in URL
    const urlToken = searchParams.get('token')
    const urlEmail = searchParams.get('email')

    if (urlToken) {
      setToken(urlToken)
      setStep('verifying')
      verifyToken(urlToken)
    } else if (urlEmail) {
      setEmail(urlEmail)
    }
  }, [searchParams])

  const verifyToken = async (verificationToken: string) => {
    setIsVerifying(true)
    try {
      // First check if token is valid
      await axios.get(`/api/auth/verify-email?token=${verificationToken}`)

      // Then verify it
      const response = await axios.post('/api/auth/verify-email', {
        token: verificationToken,
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
    } catch (error: any) {
      setStep('error')
      toaster.error({
        title: 'Verification Failed',
        description: error.response?.data?.error || 'Invalid or expired token',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      toaster.error({
        title: 'Error',
        description: 'Please enter the verification token',
      })
      return
    }

    await verifyToken(token)
  }

  return (
    <Container
      maxW="md"
      py={{ base: '12', md: '24' }}
    >
      <VStack gap="8">
        {/* Input Step */}
        {step === 'input' && (
          <>
            <VStack
              gap="2"
              align="start"
              w="full"
            >
              <Heading size="xl">Verify Your Email</Heading>
              <Text color="fg.muted">
                {email
                  ? `We sent a verification link to ${email}`
                  : 'Enter the verification token from your email'}
              </Text>
            </VStack>

            <Box
              w="full"
              as="form"
              onSubmit={handleSubmit}
            >
              <VStack gap="4">
                <Field.Root required>
                  <Field.Label>Verification Token</Field.Label>
                  <Input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste the token from your email"
                    disabled={isLoading}
                  />
                </Field.Root>

                <Button
                  type="submit"
                  w="full"
                  colorPalette="blue"
                  variant="solid"
                  loading={isLoading}
                  loadingText="Verifying..."
                >
                  Verify Email
                </Button>
              </VStack>
            </Box>
          </>
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
            <Text>The verification token is invalid or has expired.</Text>
            <Button
              colorPalette="blue"
              variant="solid"
              onClick={() => {
                setStep('input')
                setToken('')
              }}
            >
              Try Again
            </Button>
          </VStack>
        )}
      </VStack>
    </Container>
  )
}
