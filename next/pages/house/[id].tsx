import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '../../components/Layout'
import DescribeHouseV2 from '../../components/DescribeHouseV2'

const queryClient = new QueryClient()

export default function House() {
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <DescribeHouseV2 queryClient={queryClient} />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </Layout>
  )
}
