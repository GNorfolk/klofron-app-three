import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout'

const queryClient = new QueryClient()

export default function Home() {
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <ListHouses />
        <ListMarkets />
        <ListFarms />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/family">← Back to home</Link>
      </div>
    </Layout>
  )
}

function ListHouses() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['housesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-houses').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  if (data.success) {
    return (
      <div>
        <h2 className={styles.headingLg}>Houses</h2>
        <ul className={styles.list}>
          {data.map(({ id, name }) => (
            <li className={styles.listItem} key={id}>
              <p>The {name}.</p>
            </li>
          ))}
        </ul>
      </div>
    ) 
  } else {
    return (
      <div>
        <h2 className={styles.headingLg}>Houses</h2>
        <p>Backend call failed with error: {data.error}</p>
      </div>
    )
  }
}

function ListMarkets() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['marketsData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-markets').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  if (data.success) {
    return (
      <div>
        <h2 className={styles.headingLg}>Markets</h2>
        <ul className={styles.list}>
          {data.map(({ id, name }) => (
            <li className={styles.listItem} key={id}>
              <p>The {name}.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  } else {
    return (
      <div>
        <h2 className={styles.headingLg}>Markets</h2>
        <p>Backend call failed with error: {data.error}</p>
      </div>
    )
  }
}

function ListFarms() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['farmsData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-farms').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  if (data.success) {
    return (
      <div>
        <h2 className={styles.headingLg}>Farms</h2>
        <ul className={styles.list}>
          {data.map(({ id, name }) => (
            <li className={styles.listItem} key={id}>
              <p>The {name}.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  } else {
    return (
      <div>
        <h2 className={styles.headingLg}>Farms</h2>
        <p>Backend call failed with error: {data.error}</p>
      </div>
    )
  }
}
