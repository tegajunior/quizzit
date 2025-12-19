'use client'

import { useState } from 'react'
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
import {
  NativeSelectRoot,
  NativeSelectField,
} from '@chakra-ui/react/native-select'
import NextLink from 'next/link'
import axios from 'axios'
import { toaster } from '@/lib/toaster'

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organizationName: '',
    phone: '',
    role: 'user',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      const response = await axios.post('/api/auth/register', formData)

      toaster.success({
        title: 'Registration Successful!',
        description: 'Please check your email to verify your account.',
      })

      // Redirect to verification page
      setTimeout(() => {
        router.push(`/verify-email?email=${formData.email}`)
      }, 1000)
    } catch (error: unknown) {
      toaster.error({
        title: 'Registration Failed',
        description:
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : 'An error occurred',
      })
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
          <Heading size="xl">Create an Account</Heading>
          <Text color="fg.muted">
            Join Quizzit to start creating and managing quizzes
          </Text>
        </VStack>

        <Box
          w="full"
          as="form"
          onSubmit={handleSubmit}
        >
          <VStack gap="4">
            {/* First Name */}
            <Field.Root required>
              <Field.Label>First Name</Field.Label>
              <Input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                disabled={isLoading}
              />
            </Field.Root>

            {/* Last Name */}
            <Field.Root required>
              <Field.Label>Last Name</Field.Label>
              <Input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                disabled={isLoading}
              />
            </Field.Root>

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

            {/* Role Selection */}
            <Field.Root disabled={isLoading}>
              <Field.Label>Account Type</Field.Label>
              <NativeSelectRoot>
                <NativeSelectField
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">Organization / Educator</option>
                  <option value="student">Student / Employee</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </Field.Root>

            {/* Organization Name */}
            <Field.Root>
              <Field.Label>Organization Name (Optional)</Field.Label>
              <Input
                name="organizationName"
                type="text"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Your Organization"
                disabled={isLoading}
              />
            </Field.Root>

            {/* Phone */}
            <Field.Root>
              <Field.Label>Phone (Optional)</Field.Label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+2347061234567"
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
              loadingText="Creating Account..."
            >
              Create Account
            </Button>
          </VStack>
        </Box>

        {/* Login Link */}
        <Text>
          Already have an account?{' '}
          <ChakraLink
            as={NextLink}
            href="/login"
            colorPalette="green"
          >
            Log in here
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  )
}
