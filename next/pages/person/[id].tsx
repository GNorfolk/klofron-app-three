import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '../../components/Layout'
import { useSession } from 'next-auth/react'
import DescribePersonV2 from '../../components/DescribePersonV2'

const queryClient = new QueryClient()

export default function Person() {
  const { status, data } = useSession()
  const familyId = data?.user ? data.user.family_id : null
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <DescribePersonV2 queryClient={queryClient} status={status} familyId={familyId} />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </Layout>
  )
}
