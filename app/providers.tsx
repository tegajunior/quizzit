'use client'

import {
  ChakraProvider,
  defaultSystem,
  Box,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { AuthProvider } from '@/lib/context/AuthContext'
import { Toaster } from '@chakra-ui/react'
import { toaster } from '@/lib/toaster'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <AuthProvider>
        {children}
        <Toaster toaster={toaster}>
          {(toast) => {
            const getColorScheme = () => {
              switch (toast.type) {
                case 'success':
                  return {
                    bg: 'green.500',
                    icon: '✓',
                    iconBg: 'green.600',
                  }
                case 'error':
                  return {
                    bg: 'red.500',
                    icon: '✕',
                    iconBg: 'red.600',
                  }
                case 'warning':
                  return {
                    bg: 'orange.500',
                    icon: '⚠',
                    iconBg: 'orange.600',
                  }
                case 'info':
                  return {
                    bg: 'blue.500',
                    icon: 'ℹ',
                    iconBg: 'blue.600',
                  }
                default:
                  return {
                    bg: 'gray.700',
                    icon: '•',
                    iconBg: 'gray.800',
                  }
              }
            }

            const colorScheme = getColorScheme()

            return (
              <Box
                bg={colorScheme.bg}
                color="white"
                p="4"
                borderRadius="md"
                boxShadow="lg"
                minW="300px"
                maxW="500px"
              >
                <HStack
                  gap="3"
                  align="start"
                >
                  {/* Icon */}
                  <Box
                    bg={colorScheme.iconBg}
                    borderRadius="full"
                    w="8"
                    h="8"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                    fontWeight="bold"
                    fontSize="lg"
                  >
                    {colorScheme.icon}
                  </Box>

                  {/* Content */}
                  <VStack
                    align="start"
                    gap="1"
                    flex="1"
                  >
                    {toast.title && (
                      <Box
                        fontWeight="semibold"
                        fontSize="md"
                      >
                        {toast.title}
                      </Box>
                    )}
                    {toast.description && (
                      <Box
                        fontSize="sm"
                        opacity="0.9"
                      >
                        {toast.description}
                      </Box>
                    )}
                  </VStack>

                  {/* Close button */}
                  <Box
                    as="button"
                    onClick={() => toaster.dismiss(toast.id)}
                    cursor="pointer"
                    opacity="0.7"
                    _hover={{ opacity: 1 }}
                    fontSize="xl"
                    lineHeight="1"
                    flexShrink="0"
                  >
                    ×
                  </Box>
                </HStack>
              </Box>
            )
          }}
        </Toaster>
      </AuthProvider>
    </ChakraProvider>
  )
}
