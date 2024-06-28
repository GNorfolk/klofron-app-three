import { BaseLayout } from '../../@/components/component/base-layout'
import { Login } from '../../@/components/component/login'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function LogIn() {
  return (
    <BaseLayout>
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>
    </BaseLayout>
  )
}
