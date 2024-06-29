import { Login } from '../../@/components/component/login'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function LogIn() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>
    </>
  )
}
