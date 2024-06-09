import Link from 'next/link'
import styles from '../../../styles/main.module.css'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BaseLayout } from '../../../@/components/component/base-layout'
import DescribeHouseResources from '../../../components/DescribeHouseResources'
import { useSession } from 'next-auth/react'

export default function Home({ client }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <DescribeHouseResources queryClient={client} userId={userId} />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}
