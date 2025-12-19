import { Suspense } from 'react'
import VerifyEmailComponent from '@/components/auth/VerifyEmailComponent'
import { Spinner, Center } from '@chakra-ui/react'

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Center minH="100vh">
          <Spinner size="xl" />
        </Center>
      }
    >
      <VerifyEmailComponent />
    </Suspense>
  )
}
