import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Layout from '../../components/Layout'

const queryClient = new QueryClient()

export default function Home() {
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <ListHouses />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </Layout>
  )
}

function ListHouses() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['housesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  return (
    <div>
      <h2 className={styles.headingLg}>Houses</h2>
      <ul className={styles.list}>
        {data.map(({ house_id, house_name, house_rooms, house_storage }) => (
          <li className={styles.listItem} key={house_id}>
            <p>The {house_name} house has {house_rooms} rooms and {house_storage} storage.</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
