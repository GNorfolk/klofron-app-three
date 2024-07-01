import Link from 'next/link'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '../../@/components/component/base-layout'
import ListAllFamilies from '../../components/ListAllFamilies'


export default function Home({ client }) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <ListAllFamilies />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}
