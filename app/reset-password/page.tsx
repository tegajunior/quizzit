import { Suspense } from 'react'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import { Spinner, Center } from '@chakra-ui/react'

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Center minH="100vh">
          <Spinner size="xl" />
        </Center>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
