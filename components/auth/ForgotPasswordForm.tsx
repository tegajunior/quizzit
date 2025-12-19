'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Heading,
  Container,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { Field } from '@chakra-ui/react/field'
import NextLink from 'next/link'
import axios from 'axios'
import { toaster } from '@/lib/toaster'

export default function ForgotPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const isFormValid = useMemo(() => {
    return email.trim() !== '' && /\S+@\S+\.\S+/.test(email)
  }, [email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await axios.post('/api/auth/forgot-password', { email })

      toaster.success({
        title: 'Email Sent!',
        description: 'Check your email for password reset instructions.',
      })

      setEmailSent(true)
    } catch (error: unknown) {
      toaster.error({
        title: 'Error',
        description:
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : 'Failed to send reset email. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <Container
        maxW="md"
        py={{ base: '12', md: '24' }}
      >
        <VStack
          gap="6"
          textAlign="center"
        >
          <Heading size="xl">Check Your Email</Heading>
          <Text color="fg.muted">
            We&apos;ve sent password reset instructions to{' '}
            <strong>{email}</strong>
          </Text>
          <Text fontSize="sm">
            Click the link in the email to reset your password. The link will
            expire in 1 hour.
          </Text>
          <Text
            fontSize="sm"
            color="fg.muted"
          >
            Don&apos;t see the email? Check your spam folder.
          </Text>
          <Button
            onClick={() => setEmailSent(false)}
            variant="outline"
            colorPalette="blue"
          >
            Resend Email
          </Button>
          <ChakraLink
            as={NextLink}
            href="/login"
            colorPalette="blue"
          >
            Back to Login
          </ChakraLink>
        </VStack>
      </Container>
    )
  }

  return (
    <Container
      maxW="md"
      py={{ base: '12', md: '24' }}
    >
      <VStack gap="8">
        <VStack
          gap="2"
          align="start"
          w="full"
        >
          <Heading size="xl">Forgot Password?</Heading>
          <Text color="fg.muted">
            Enter your email address and we&apos;ll send you instructions to
            reset your password.
          </Text>
        </VStack>

        <Box
          w="full"
          as="form"
          onSubmit={handleSubmit}
        >
          <VStack gap="4">
            {/* Email */}
            <Field.Root required>
              <Field.Label>Email Address</Field.Label>
              <Input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                disabled={isLoading}
              />
            </Field.Root>

            {/* Submit Button */}
            <Button
              type="submit"
              w="full"
              colorPalette="blue"
              variant="solid"
              loading={isLoading}
              loadingText="Sending..."
              disabled={!isFormValid || isLoading}
            >
              Send Reset Link
            </Button>
          </VStack>
        </Box>

        {/* Back to Login Link */}
        <Text>
          Remember your password?{' '}
          <ChakraLink
            as={NextLink}
            href="/login"
            colorPalette="blue"
          >
            Back to Login
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  )
}
