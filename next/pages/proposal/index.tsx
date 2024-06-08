import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '../../components/Layout'
import ListAllProposals from '../../components/ListAllProposals'

export default function Family({ client }) {
  return (
    <Layout>
    <QueryClientProvider client={client}>
        <ListAllProposals />
      </QueryClientProvider>
    <div className={styles.backToHome}>
      <Link href="/">← Back to home</Link>
    </div>
  </Layout>
  )
}
