import Link from 'next/link'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '../../@/components/component/base-layout'
import ListAllProposals from '../../components/ListAllProposals'

export default function Family({ client }) {
  return (
    <BaseLayout>
    <QueryClientProvider client={client}>
        <ListAllProposals />
      </QueryClientProvider>
    <div className="mt-12 mx-0 mb-0">
      <Link href="/">← Back to home</Link>
    </div>
  </BaseLayout>
  )
}
