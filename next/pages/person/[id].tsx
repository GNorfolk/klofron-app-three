import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '../../components/Layout'
import { useSession } from 'next-auth/react'
import DescribePerson from '../../components/DescribePerson'

const queryClient = new QueryClient()

export default function Person() {
  const { status, data } = useSession()
  const familyId = data?.user ? 2 : null
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <DescribePerson queryClient={queryClient} status={status} familyId={familyId} />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </Layout>
  )
}
