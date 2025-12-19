'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { AuthProvider } from '@/lib/context/AuthContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <AuthProvider>{children}</AuthProvider>
    </ChakraProvider>
  )
}
