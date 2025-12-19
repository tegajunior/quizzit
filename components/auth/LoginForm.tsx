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
import axios, { AxiosError } from 'axios'
import { toaster } from '@/lib/toaster'

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // Check if form is valid for submission
  const isFormValid = useMemo(() => {
    return formData.email.trim() !== '' && formData.password !== ''
  }, [formData.email, formData.password])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post('/api/auth/login', formData)

      toaster.success({
        title: 'Login Successful!',
        description: 'Welcome back to Quizzit',
      })

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{
        error?: string
        requiresVerification?: boolean
      }>
      if (axiosError.response?.data?.requiresVerification) {
        toaster.warning({
          title: 'Email Not Verified',
          description: 'Please verify your email before logging in.',
        })

        // Redirect to verification page
        setTimeout(() => {
          router.push(`/verify-email?email=${formData.email}`)
        }, 1000)
      } else {
        toaster.error({
          title: 'Login Failed',
          description:
            axiosError.response?.data?.error || 'Invalid email or password',
        })
      }
    } finally {
      setIsLoading(false)
    }
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
          <Heading size="xl">Welcome Back</Heading>
          <Text color="fg.muted">Sign in to your Quizzit account</Text>
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
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@example.com"
                disabled={isLoading}
              />
            </Field.Root>

            {/* Password */}
            <Field.Root required>
              <Field.Label>Password</Field.Label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </Field.Root>

            {/* Forgot Password Link */}
            <Text
              textAlign="right"
              w="full"
            >
              <ChakraLink
                as={NextLink}
                href="/forgot-password"
                colorPalette="blue"
                fontSize="sm"
              >
                Forgot password?
              </ChakraLink>
            </Text>

            {/* Submit Button */}
            <Button
              type="submit"
              w="full"
              colorPalette="green"
              variant="solid"
              loading={isLoading}
              loadingText="Signing in..."
              disabled={!isFormValid || isLoading}
            >
              Sign In
            </Button>
          </VStack>
        </Box>

        {/* Register Link */}
        <Text>
          Don &apos; t have an account?{' '}
          <ChakraLink
            as={NextLink}
            href="/register"
            colorPalette="blue"
          >
            Create one here
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  )
}
