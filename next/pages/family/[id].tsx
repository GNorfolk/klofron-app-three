import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Layout, { siteTitle } from '../../components/layout'
import Head from 'next/head'

const queryClient = new QueryClient()

export default function Family() {
  return (
    <Layout>
    <Head>
      <title>{siteTitle}</title>
    </Head>
    <QueryClientProvider client={queryClient}>
        <DescribeFamily />
        <ListFamilyPeople />
        <ListFamilyHouses />
      </QueryClientProvider>
    <div className={styles.backToHome}>
      <Link href="/">← Back to home</Link>
    </div>
  </Layout>
  )
}

function DescribeFamily() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/describe-family/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <div>
        {data.map(({ id, name }) => (
          <h1 className={styles.heading2Xl} key={id}>The {name} family.</h1>
        ))}
      </div>
    )
  }
}

function ListFamilyHouses() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyHouseData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-family-houses/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>House Info</h2>
        <ul className={styles.list}>
          {data.map(({ id, name, family_name, food, wood }) => (
            <li className={styles.listItem} key={id}>
              <p>The {family_name} family own <Link href={`/house/${id}`}>{name}</Link>.</p>
              <p>House {name} holds {food} food and {wood} wood.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

function ListFamilyPeople() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyMemberData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-family-people/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>Person Info</h2>
        <ul className={styles.list}>
          {data.map(({ id, name, family_name, gender, age, house_name }) => (
            <li className={styles.listItem} key={id}>
              <p><Link href={"/person/" + id}>{name + ' ' + family_name}</Link> is {gender} and {age} years old and lives at {house_name}.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
