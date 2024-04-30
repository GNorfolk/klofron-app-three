import Link from 'next/link'
import styles from '../../../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '../../../components/Layout'
import ManageFamilyTravel from '../../../components/ManageFamilyTravel'
import { useSession } from 'next-auth/react'

const queryClient = new QueryClient()

export default function Family() {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <Layout>
    <QueryClientProvider client={queryClient}>
      <ManageFamilyTravel queryClient={queryClient} userId={userId} />
    </QueryClientProvider>
    <div className={styles.backToHome}>
      <Link href="/">← Back to home</Link>
    </div>
  </Layout>
  )
}
