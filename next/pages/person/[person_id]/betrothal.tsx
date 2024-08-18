import Link from 'next/link'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '../../../@/components/component/base-layout'
import DescribePersonBetrothal from '../../../components/DescribePersonBetrothal'
import { useSession } from 'next-auth/react'

export default function Family({ client, router }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <DescribePersonBetrothal userId={userId} queryClient={client} router={router} />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}
