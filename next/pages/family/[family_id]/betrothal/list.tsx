import Link from 'next/link'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '../../../../@/components/component/base-layout'
import DescribeFamilyBetrothals from '../../../../components/DescribeFamilyBetrothals'
import { useSession } from 'next-auth/react'

export default function Family({ client }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <DescribeFamilyBetrothals userId={userId} queryClient={client} />
      </QueryClientProvider>
    <div className="mt-12 mx-0 mb-0">
      <Link href="/">← Back to home</Link>
    </div>
  </BaseLayout>
  )
}
