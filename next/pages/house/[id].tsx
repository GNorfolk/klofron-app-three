import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '../../@/components/component/base-layout'
import { useSession } from 'next-auth/react'
import DescribeHouse from '../../components/DescribeHouse'

export default function House({ client }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <DescribeHouse queryClient={client} userId={userId} />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

