import { BaseLayout } from '@/components/component/base-layout'
import { Register } from '@/components/component/register'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Main() {
  return (
    <BaseLayout>
      <QueryClientProvider client={queryClient}>
        <Register queryClient={queryClient} />
      </QueryClientProvider>
    </BaseLayout>
  )
}
