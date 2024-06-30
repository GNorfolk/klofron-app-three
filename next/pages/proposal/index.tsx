import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '../../@/components/component/base-layout'
import ListAllProposals from '../../components/ListAllProposals'

export default function Family({ client }) {
  return (
    <BaseLayout>
    <QueryClientProvider client={client}>
        <ListAllProposals />
      </QueryClientProvider>
    <div className={styles.backToHome}>
      <Link href="/">← Back to home</Link>
    </div>
  </BaseLayout>
  )
}
