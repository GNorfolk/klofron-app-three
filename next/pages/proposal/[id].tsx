import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Layout from '../../components/layout'
import axios from 'axios'

const queryClient = new QueryClient()

export default function Family() {
  return (
    <Layout>
    <QueryClientProvider client={queryClient}>
        <ListProposals />
      </QueryClientProvider>
    <div className={styles.backToHome}>
      <Link href="/family">← Back to home</Link>
    </div>
  </Layout>
  )
}

function ListProposals() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['listProposalsData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-proposals/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    const acceptProposal = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/accept-proposal/' + id)
      },
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    if (data.success) {
      return (
        <div>
          <h2 className={styles.headingLg}>Proposal Info</h2>
          <ul className={styles.list}>
            {data.data.map(({ id, name, family_name }) => (
              <li className={styles.listItem} key={id}>
                {name} {family_name}. <button onClick={
                  () => {
                      acceptProposal.mutate(id, { onSettled: (res) => {
                        queryClient.invalidateQueries()
                      }
                    })
                  }
                }>Accept Proposal</button>
              </li>
            ))}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <h2 className={styles.headingLg}>Proposal Info</h2>
          <p>Backend call failed with error: {data.error}</p>
        </div>
      )
    }
  }
}
