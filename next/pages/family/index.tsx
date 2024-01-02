import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Layout from '../../components/Layout'

const queryClient = new QueryClient()

export default function Home() {
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <ListFamilies />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </Layout>
  )
}

function ListFamilies() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['familiesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  return (
    <div>
      <h2 className={styles.headingLg}>Families</h2>
      <ul className={styles.list}>
        {data.map(({ family_id, family_name }) => (
          <li className={styles.listItem} key={family_id}>
            <p>The <Link href={`/family/${family_id}`}>{family_name}</Link> family.</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
