import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '../../components/Layout'
import { useSession } from 'next-auth/react'
import DescribeHouse from '../../components/DescribeHouse'

const queryClient = new QueryClient()

export default function House() {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <DescribeHouse queryClient={queryClient} userId={userId} />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </Layout>
  )
}

