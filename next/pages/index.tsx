import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import styles from '../styles/people.module.css'
import Link from 'next/link'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Welcome to the website!</p>
      </section>
      <QueryClientProvider client={queryClient}>
        <ListFamilies />
      </QueryClientProvider>
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

  if (isLoading) return <div className={styles.container}>Loading...</div>
  if (error) return <div className={styles.container}>Failed to load</div>

  return (
    <div>
      <h2 className={styles.headingLg}>Families</h2>
      <ul className={styles.list}>
        {data.map(({ id, name }) => (
          <li className={styles.listItem} key={id}>
            <p>The <Link href={`/family/${id}`}>{name}</Link> family.</p>
          </li>
        ))}
      </ul>
    </div>
  )
}