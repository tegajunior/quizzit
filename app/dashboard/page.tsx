'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Heading,
  Button,
  VStack,
  HStack,
  Text,
  Spinner,
} from '@chakra-ui/react'
import axios from 'axios'
import { toaster } from '@/lib/toaster'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  organizationName?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      setUser(response.data.user)
    } catch {
      toaster.error({
        title: 'Error',
        description: 'Failed to load user data',
      })
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout')
      toaster.success({
        title: 'Logged Out',
        description: 'You have been logged out successfully',
      })
      router.push('/login')
    } catch {
      toaster.error({
        title: 'Error',
        description: 'Failed to logout',
      })
    }
  }

  if (isLoading) {
    return (
      <Container
        maxW="full"
        h="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack>
          <Spinner
            size="lg"
            color="bg.emphasized"
          />
          <Text color="fg.muted">Loading...</Text>
        </VStack>
      </Container>
    )
  }

  return (
    <Container
      maxW="6xl"
      py="8"
    >
      <VStack
        gap="8"
        align="start"
        w="full"
      >
        {/* Header */}
        <HStack
          justify="space-between"
          w="full"
        >
          <VStack
            align="start"
            gap="2"
          >
            <Heading size="lg">Welcome, {user?.firstName}!</Heading>
            <Text color="gray.600">{user?.email}</Text>
            {user?.organizationName && (
              <Text
                color="gray.600"
                fontSize="sm"
              >
                Organization: {user.organizationName}
              </Text>
            )}
          </VStack>
          <Button
            colorScheme="red"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </HStack>

        {/* Main Content */}
        <Box
          w="full"
          p="8"
          bg="white"
          borderRadius="lg"
          shadow="md"
        >
          <VStack
            gap="4"
            align="start"
          >
            <Heading size="md">Dashboard</Heading>
            <Text color="gray.600">
              This is your dashboard. More features coming soon!
            </Text>

            {user?.role === 'admin' || user?.role === 'user' ? (
              <VStack
                gap="2"
                w="full"
              >
                <Text fontWeight="bold">Organization/Educator Features:</Text>
                <Button
                  w="full"
                  colorScheme="blue"
                  variant="outline"
                >
                  Create New Quiz
                </Button>
                <Button
                  w="full"
                  colorScheme="blue"
                  variant="outline"
                >
                  View Results
                </Button>
                <Button
                  w="full"
                  colorScheme="blue"
                  variant="outline"
                >
                  Manage Students
                </Button>
              </VStack>
            ) : (
              <VStack
                gap="2"
                w="full"
              >
                <Text fontWeight="bold">Student Features:</Text>
                <Button
                  w="full"
                  colorScheme="blue"
                  variant="outline"
                >
                  View Available Quizzes
                </Button>
                <Button
                  w="full"
                  colorScheme="blue"
                  variant="outline"
                >
                  My Results
                </Button>
              </VStack>
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}
