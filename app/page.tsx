'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Grid,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useAuth } from '@/lib/context/AuthContext'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <Box
        h="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text>Loading...</Text>
      </Box>
    )
  }

  return (
    <Box>
      {/* Navigation */}
      <Box
        bg="bg.panel"
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container
          maxW="6xl"
          py="4"
        >
          <HStack justify="space-between">
            <Heading size="md">🎯 Quizzit</Heading>
            <HStack gap={4}>
              <NextLink href="/login">
                <Button
                  variant="ghost"
                  colorPalette="gray"
                >
                  Login
                </Button>
              </NextLink>
              <NextLink href="/register">
                <Button
                  colorPalette="blue"
                  variant="solid"
                >
                  Sign Up
                </Button>
              </NextLink>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        color="white"
        py={{ base: '20', md: '32' }}
      >
        <Container maxW="4xl">
          <VStack
            gap="8"
            textAlign="center"
          >
            <Heading size="2xl">
              Create, Manage, and Proctor Online Quizzes Effortlessly
            </Heading>
            <Text
              fontSize="lg"
              color="fg.subtle"
            >
              Quizzit is your complete platform for creating and managing online
              exams with webcam proctoring, real-time results, and comprehensive
              analytics.
            </Text>
            <HStack gap="4">
              <NextLink href="/register">
                <Button
                  size="lg"
                  colorPalette="purple"
                  variant="solid"
                >
                  Get Started Free
                </Button>
              </NextLink>
              <Button
                size="lg"
                variant="outline"
                borderColor="white"
                color="white"
              >
                Learn More
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container
        maxW="6xl"
        py={{ base: '16', md: '24' }}
      >
        <VStack gap="16">
          <VStack
            gap="4"
            textAlign="center"
          >
            <Heading>Why Choose Quizzit?</Heading>
            <Text
              color="fg.muted"
              fontSize="lg"
            >
              Everything you need to create, manage, and proctor online
              assessments
            </Text>
          </VStack>

          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap="8"
            w="full"
          >
            {/* Feature 1 */}
            <Box
              p="8"
              layerStyle="fill.subtle"
              colorPalette="blue"
              borderRadius="lg"
            >
              <Heading
                size="md"
                mb="4"
              >
                📝 Easy Quiz Creation
              </Heading>
              <Text color="fg.muted">
                Create multiple-choice quizzes with drag-and-drop interface. Set
                time limits and auto-grading.
              </Text>
            </Box>

            {/* Feature 2 */}
            <Box
              p="8"
              layerStyle="fill.subtle"
              colorPalette="green"
              borderRadius="lg"
            >
              <Heading
                size="md"
                mb="4"
              >
                🎥 Webcam Proctoring
              </Heading>
              <Text color="fg.muted">
                Prevent cheating with automatic webcam recording. AI-powered
                proctoring alerts for suspicious behavior.
              </Text>
            </Box>

            {/* Feature 3 */}
            <Box
              p="8"
              layerStyle="fill.subtle"
              colorPalette="purple"
              borderRadius="lg"
            >
              <Heading
                size="md"
                mb="4"
              >
                📊 Real-time Analytics
              </Heading>
              <Text color="fg.muted">
                Get instant results, detailed analytics, and performance
                insights. Track student progress in real-time.
              </Text>
            </Box>

            {/* Feature 4 */}
            <Box
              p="8"
              layerStyle="fill.subtle"
              colorPalette="orange"
              borderRadius="lg"
            >
              <Heading
                size="md"
                mb="4"
              >
                🔐 Secure & Reliable
              </Heading>
              <Text color="fg.muted">
                Enterprise-grade security with encrypted data storage and SSL
                protection. GDPR compliant.
              </Text>
            </Box>

            {/* Feature 5 */}
            <Box
              p="8"
              layerStyle="fill.subtle"
              colorPalette="red"
              borderRadius="lg"
            >
              <Heading
                size="md"
                mb="4"
              >
                ⏱️ Timed Assessments
              </Heading>
              <Text color="fg.muted">
                Set custom time limits per question or overall test. Auto-submit
                when time expires.
              </Text>
            </Box>

            {/* Feature 6 */}
            <Box
              p="8"
              layerStyle="fill.subtle"
              colorPalette="cyan"
              borderRadius="lg"
            >
              <Heading
                size="md"
                mb="4"
              >
                👥 Student Management
              </Heading>
              <Text color="fg.muted">
                Easily manage student lists, send invite links, and track
                participation rates.
              </Text>
            </Box>
          </Grid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box
        layerStyle="fill.surface"
        py={{ base: '16', md: '24' }}
      >
        <Container
          maxW="4xl"
          textAlign="center"
        >
          <VStack gap="8">
            <Heading>Ready to Get Started?</Heading>
            <Text
              color="fg.muted"
              fontSize="lg"
            >
              Join thousands of educators and organizations already using
              Quizzit
            </Text>
            <NextLink href="/register">
              <Button
                size="lg"
                colorPalette="blue"
                variant="solid"
              >
                Sign Up Now
              </Button>
            </NextLink>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        bg="bg.subtle"
        py="8"
        borderTopWidth="1"
        borderColor="bg.panel"
      >
        <Container maxW="6xl">
          <VStack
            gap="4"
            align="start"
          >
            <Text fontWeight="bold">🎯 Quizzit</Text>
            <Text
              color="fg.muted"
              fontSize="sm"
            >
              © 2025 Quizzit. All rights reserved. | Privacy Policy | Terms of
              Service
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}
