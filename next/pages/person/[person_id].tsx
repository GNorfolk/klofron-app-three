import Link from 'next/link'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '../../@/components/component/base-layout'
import { useSession } from 'next-auth/react'
import DescribePerson from '../../components/DescribePerson'

export default function Person({ client, router }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <DescribePerson queryClient={client} status={status} userId={userId} router={router} />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}
