import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Layout from '../../components/Layout'
import ListAllHouses from '../../components/ListAllHouses'

const queryClient = new QueryClient()

export default function Home() {
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <ListAllHouses />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </Layout>
  )
}
