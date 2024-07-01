import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BaseLayout } from '../../@/components/component/base-layout'
import ListAllHouses from '../../components/ListAllHouses'

export default function Home({ client }) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <ListAllHouses />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}
