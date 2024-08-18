import Link from 'next/link'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BaseLayout } from '../../@/components/component/base-layout'
import ListAllPeople from '../../components/ListAllPeople'

export default function Home({ client, router }) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <ListAllPeople />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}
