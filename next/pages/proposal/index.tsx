import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Layout from '../../components/MainLayout'

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
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-proposals').then(
        (res) => res.json(),
      ),
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
              <p><Link href={"/person/" + id}>{name + " " + family_name}</Link>.</p>
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
