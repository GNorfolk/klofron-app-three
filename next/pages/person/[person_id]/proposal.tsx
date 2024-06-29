import Link from 'next/link'
import styles from '../../../styles/main.module.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DescribePersonProposals from '../../../components/DescribePersonProposals'
import { useSession } from 'next-auth/react'

export default function Family({ client }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <>
      <QueryClientProvider client={client}>
        <DescribePersonProposals userId={userId} queryClient={client} />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </>
  )
}
