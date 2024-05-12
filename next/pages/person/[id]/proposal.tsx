import Link from 'next/link'
import styles from '../../../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '../../../components/Layout'
import ManagePersonProposals from '../../../components/ManagePersonProposals'

const queryClient = new QueryClient()

export default function Family() {
  const router = useRouter()
  if (router.isReady) {
    return (
      <Layout>
        <QueryClientProvider client={queryClient}>
          <ManagePersonProposals accepterPersonId={router.query.id} queryClient={queryClient} />
        </QueryClientProvider>
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      </Layout>
    )
  }
}
