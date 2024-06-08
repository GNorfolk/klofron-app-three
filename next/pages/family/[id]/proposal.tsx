import Link from 'next/link'
import styles from '../../../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '../../../components/Layout'
import DescribeFamilyProposals from '../../../components/DescribeFamilyProposals'
import { useSession } from 'next-auth/react'

export default function Family({ client }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <Layout>
      <QueryClientProvider client={client}>
        <DescribeFamilyProposals userId={userId} queryClient={client} />
      </QueryClientProvider>
    <div className={styles.backToHome}>
      <Link href="/">← Back to home</Link>
    </div>
  </Layout>
  )
}
