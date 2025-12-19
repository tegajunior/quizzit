'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Heading,
  Container,
  HStack,
  Spinner,
} from '@chakra-ui/react'
import { Field } from '@chakra-ui/react/field'
import axios from 'axios'
import { toaster } from '@/lib/toaster'

// Password validation helper
const validatePassword = (password: string) => {
  const minLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return {
    minLength,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
    isValid: minLength && hasUppercase && hasNumber && hasSpecialChar,
  }
}

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [token, setToken] = useState<string>('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  })

  useEffect(() => {
    const urlToken = searchParams.get('token')

    if (!urlToken) {
      toaster.error({
        title: 'Invalid Link',
        description: 'Password reset link is missing.',
      })
      setTimeout(() => {
        router.push('/forgot-password')
      }, 2000)
      return
    }

    // Validate token with backend
    const validateToken = async () => {
      setIsValidating(true)
      try {
        await axios.get(`/api/auth/reset-password?token=${urlToken}`)
        setToken(urlToken)
        setTokenValid(true)
      } catch (error: unknown) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : 'Invalid or expired reset link'

        toaster.error({
          title: 'Invalid Link',
          description: errorMessage,
        })

        setTokenValid(false)
        setTimeout(() => {
          router.push('/forgot-password')
        }, 3000)
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [searchParams, router])

  // Validate password strength in real-time
  const passwordValidation = useMemo(
    () => validatePassword(password),
    [password]
  )

  // Check if passwords match
  const passwordsMatch = password === confirmPassword && confirmPassword !== ''

  const passwordsDontMatch =
    touched.confirmPassword &&
    confirmPassword !== '' &&
    password !== confirmPassword

  // Check if form is valid for submission
  const isFormValid = useMemo(() => {
    return (
      password !== '' &&
      confirmPassword !== '' &&
      passwordValidation.isValid &&
      password === confirmPassword
    )
  }, [password, confirmPassword, passwordValidation.isValid])

  const handleBlur = (field: 'password' | 'confirmPassword') => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toaster.error({
        title: 'Error',
        description: 'Invalid reset token.',
      })
      return
    }

    if (!passwordValidation.isValid) {
      toaster.error({
        title: 'Weak Password',
        description: 'Please ensure your password meets all the requirements.',
      })
      return
    }

    if (password !== confirmPassword) {
      toaster.error({
        title: "Passwords Don't Match",
        description: 'Please ensure both passwords are identical.',
      })
      return
    }

    setIsLoading(true)

    try {
      await axios.post('/api/auth/reset-password', {
        token,
        password,
      })

      toaster.success({
        title: 'Password Reset Successful!',
        description: 'You can now login with your new password.',
      })

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: unknown) {
      toaster.error({
        title: 'Reset Failed',
        description:
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : 'Failed to reset password. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while validating token
  if (isValidating) {
    return (
      <Container
        maxW="md"
        py={{ base: '12', md: '24' }}
      >
        <VStack
          gap="4"
          textAlign="center"
        >
          <Spinner
            size="lg"
            colorPalette="blue"
          />
          <Heading size="md">Validating Reset Link</Heading>
          <Text color="fg.muted">
            Please wait while we verify your reset link...
          </Text>
        </VStack>
      </Container>
    )
  }

  // Show error if token is invalid
  if (!tokenValid) {
    return (
      <Container
        maxW="md"
        py={{ base: '12', md: '24' }}
      >
        <VStack
          gap="6"
          textAlign="center"
        >
          <Heading
            size="xl"
            color="red.500"
          >
            ❌ Invalid Link
          </Heading>
          <Text color="fg.muted">
            This password reset link is invalid or has expired.
          </Text>
          <Text fontSize="sm">
            Redirecting you to request a new reset link...
          </Text>
          <Spinner
            size="sm"
            colorPalette="blue"
          />
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
          <Heading size="xl">Reset Password</Heading>
          <Text color="fg.muted">Enter your new password below.</Text>
        </VStack>

        <Box
          w="full"
          as="form"
          onSubmit={handleSubmit}
        >
          <VStack gap="4">
            {/* Password */}
            <Field.Root required>
              <Field.Label>New Password</Field.Label>
              <Input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {/* Password strength indicators */}
              {touched.password && password && (
                <VStack
                  gap="1"
                  align="start"
                  mt="2"
                  fontSize="sm"
                >
                  <HStack gap="2">
                    <Text
                      color={
                        passwordValidation.minLength ? 'green.500' : 'red.500'
                      }
                    >
                      {passwordValidation.minLength ? '✓' : '✗'}
                    </Text>
                    <Text
                      color={
                        passwordValidation.minLength
                          ? 'fg.muted'
                          : 'fg.emphasized'
                      }
                    >
                      At least 8 characters
                    </Text>
                  </HStack>
                  <HStack gap="2">
                    <Text
                      color={
                        passwordValidation.hasUppercase
                          ? 'green.500'
                          : 'red.500'
                      }
                    >
                      {passwordValidation.hasUppercase ? '✓' : '✗'}
                    </Text>
                    <Text
                      color={
                        passwordValidation.hasUppercase
                          ? 'fg.muted'
                          : 'fg.emphasized'
                      }
                    >
                      One uppercase letter
                    </Text>
                  </HStack>
                  <HStack gap="2">
                    <Text
                      color={
                        passwordValidation.hasNumber ? 'green.500' : 'red.500'
                      }
                    >
                      {passwordValidation.hasNumber ? '✓' : '✗'}
                    </Text>
                    <Text
                      color={
                        passwordValidation.hasNumber
                          ? 'fg.muted'
                          : 'fg.emphasized'
                      }
                    >
                      One number
                    </Text>
                  </HStack>
                  <HStack gap="2">
                    <Text
                      color={
                        passwordValidation.hasSpecialChar
                          ? 'green.500'
                          : 'red.500'
                      }
                    >
                      {passwordValidation.hasSpecialChar ? '✓' : '✗'}
                    </Text>
                    <Text
                      color={
                        passwordValidation.hasSpecialChar
                          ? 'fg.muted'
                          : 'fg.emphasized'
                      }
                    >
                      One special character (!@#$%^&*...)
                    </Text>
                  </HStack>
                </VStack>
              )}
            </Field.Root>

            {/* Confirm Password */}
            <Field.Root required>
              <Field.Label>Confirm New Password</Field.Label>
              <Input
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {/* Password match indicator */}
              {passwordsMatch && (
                <Text
                  fontSize="sm"
                  color="green.500"
                  mt="2"
                >
                  ✓ Passwords match
                </Text>
              )}
              {passwordsDontMatch && (
                <Text
                  fontSize="sm"
                  color="red.500"
                  mt="2"
                >
                  ✗ Passwords don&apos;t match
                </Text>
              )}
            </Field.Root>

            {/* Submit Button */}
            <Button
              type="submit"
              w="full"
              colorPalette="blue"
              variant="solid"
              loading={isLoading}
              loadingText="Resetting Password..."
              disabled={!isFormValid || isLoading}
            >
              Reset Password
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}
