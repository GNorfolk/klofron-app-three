import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, QueryClientProvider, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import ManagePersonProposals from './ManagePersonProposals'
import ListPersonProposals from './ListPersonProposals'

export default function DescribePersonProposals({ userId, queryClient }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['describePersonProposalsData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    return (
      <QueryClientProvider client={queryClient}>
        <ListPersonProposals data={data} showLink={false} queryClient={queryClient} userId={userId} />
        <ManagePersonProposals personData={data} queryClient={queryClient} userId={userId} />
      </QueryClientProvider>
    )
  }
}