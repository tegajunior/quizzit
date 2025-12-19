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
  HStack,
} from '@chakra-ui/react'
import { Field } from '@chakra-ui/react/field'
import {
  NativeSelectRoot,
  NativeSelectField,
} from '@chakra-ui/react/native-select'
import NextLink from 'next/link'
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

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organizationName: '',
    phone: '',
    role: 'user',
  })
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  })

  // Validate password strength in real-time
  const passwordValidation = useMemo(
    () => validatePassword(formData.password),
    [formData.password]
  )

  // Check if passwords match
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== ''

  const passwordsDontMatch =
    touched.confirmPassword &&
    formData.confirmPassword !== '' &&
    formData.password !== formData.confirmPassword

  // Check if form is valid for submission
  const isFormValid = useMemo(() => {
    const requiredFieldsFilled =
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password !== '' &&
      formData.confirmPassword !== ''

    const passwordsAreValid =
      passwordValidation.isValid &&
      formData.password === formData.confirmPassword

    return requiredFieldsFilled && passwordsAreValid
  }, [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.password,
    formData.confirmPassword,
    passwordValidation.isValid,
  ])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBlur = (field: 'password' | 'confirmPassword') => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password before submission
    if (!passwordValidation.isValid) {
      toaster.error({
        title: 'Weak Password',
        description: 'Please ensure your password meets all the requirements.',
      })
      return
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toaster.error({
        title: "Passwords Don't Match",
        description: 'Please ensure both passwords are identical.',
      })
      return
    }

    setIsLoading(true)

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData
      const response = await axios.post('/api/auth/register', registrationData)

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
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {/* Password strength indicators */}
              {touched.password && formData.password && (
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
              <Field.Label>Confirm Password</Field.Label>
              <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              colorPalette="green"
              variant="solid"
              loading={isLoading}
              loadingText="Creating Account..."
              disabled={!isFormValid || isLoading}
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
            colorPalette="blue"
          >
            Log in here
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  )
}
