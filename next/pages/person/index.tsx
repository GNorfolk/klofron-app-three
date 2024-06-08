import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Layout from '../../components/Layout'
import ListAllPeople from '../../components/ListAllPeople'

export default function Home({ client }) {
  return (
    <Layout>
      <QueryClientProvider client={client}>
        <ListAllPeople />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </Layout>
  )
}
