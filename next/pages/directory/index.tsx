import Link from 'next/link'
import { BaseLayout } from '../../@/components/component/base-layout'
import { QueryClientProvider } from '@tanstack/react-query'
import ListAllEntities from '../../components/ListAllEntities'

export default function Family({ client, router }) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <ListAllEntities queryClient={client} />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}
