import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout'

const queryClient = new QueryClient()
console.log("NODE_ENV: " + JSON.stringify(process.env.NODE_ENV))
console.log("NEXTAUTH_URL: " + JSON.stringify(process.env.NEXTAUTH_URL))
console.log("NEXT_PUBLIC_NEXTAUTH_URL: " + JSON.stringify(process.env.NEXT_PUBLIC_NEXTAUTH_URL))

export default function Home() {
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <ListFamilies />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/family">← Back to home</Link>
      </div>
    </Layout>
  )
}

function ListFamilies() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['familiesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-families').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  if (data.success) {
    return (
      <div>
        <h2 className={styles.headingLg}>Families</h2>
        <ul className={styles.list}>
          {data.data.map(({ id, name }) => (
            <li className={styles.listItem} key={id}>
              <p>The <Link href={`/family/${id}`}>{name}</Link> family.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  } else {
    return (
      <div>
        <h2 className={styles.headingLg}>Families</h2>
        <p>Backend call failed with error: {data.error}</p>
      </div>
    )
  }
}
