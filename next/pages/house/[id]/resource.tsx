import Link from 'next/link'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BaseLayout } from '../../../@/components/component/base-layout'
import DescribeHouseResources from '../../../components/DescribeHouseResources'
import { useSession } from 'next-auth/react'

export default function Home({ client, router }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <DescribeHouseResources queryClient={client} userId={userId} router={router} />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}
