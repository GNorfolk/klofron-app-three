import Link from 'next/link'
import styles from '../../../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '../../../components/Layout'
import ManageFamilyTravel from '../../../components/ManageFamilyTravel'

const queryClient = new QueryClient()

export default function Family() {
  const router = useRouter()
  if (router.isReady) {
    return (
      <Layout>
      <QueryClientProvider client={queryClient}>
        <ManageFamilyTravel familyId={router.query.id} />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </Layout>
    )
  }
}
