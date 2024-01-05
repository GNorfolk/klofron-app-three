import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Layout from '../../components/Layout'

const queryClient = new QueryClient()

export default function Family() {
  return (
    <Layout>
    <QueryClientProvider client={queryClient}>
        <ListProposals />
      </QueryClientProvider>
    <div className={styles.backToHome}>
      <Link href="/">← Back to home</Link>
    </div>
  </Layout>
  )
}

function ListProposals() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['listProposalsData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  return (
    <div>
      <h2 className={styles.headingLg}>Proposal Info</h2>
      <ul className={styles.list}>
        {data.map(({ proposal_id, proposal_proposer_person_id, proposal_proposer_person }) => (
          <li className={styles.listItem} key={proposal_id}>
            <Link href={"/person/" + proposal_proposer_person_id}>{proposal_proposer_person.person_name + " " + proposal_proposer_person.person_family.family_name}</Link>.
          </li>
        ))}
      </ul>
    </div>
  )
}
