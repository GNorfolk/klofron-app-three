import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Layout from '../../components/Layout'
import ListAllProposals from '../../components/ListAllProposals'

const queryClient = new QueryClient()

export default function Family() {
  return (
    <Layout>
    <QueryClientProvider client={queryClient}>
        <ListAllProposals />
      </QueryClientProvider>
    <div className={styles.backToHome}>
      <Link href="/">← Back to home</Link>
    </div>
  </Layout>
  )
}
