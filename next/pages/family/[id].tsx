import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Layout from '../../components/MainLayout'

const queryClient = new QueryClient()

export default function Family() {
  return (
    <Layout>
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
        {data.data.map(({ id, name }) => (
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

    if (data.success) {
      return (
        <div>
          <h2 className={styles.headingLg}>House Info</h2>
          <ul className={styles.list}>
            {data.data.map(({ id, name, family_name, food, wood, type_name }) => (
              <li className={styles.listItem} key={id}>
                <p>The {family_name} family own <Link href={`/house/${id}`}>{name}</Link> which is a {type_name}.</p>
                <p>{name} holds {food} food and {wood} wood.</p>
              </li>
            ))}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <h2 className={styles.headingLg}>House Info</h2>
          <p>Backend call failed with error: {data.error}</p>
        </div>
      )
    }
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

    if (data.success) {
      return (
        <div>
          <h2 className={styles.headingLg}>Person Info</h2>
          <ul className={styles.list}>
            {data.data.map(({ id, name, family_name, gender, age, house_name }) => (
              <li className={styles.listItem} key={id}>
                {
                  house_name ?
                    <p><Link href={"/person/" + id}>{name + ' ' + family_name}</Link> is {gender} and {age} years old and lives at {house_name}.</p>
                  :
                    <p><Link href={"/person/" + id}>{name + ' ' + family_name}</Link> is {gender} and {age} years old and is of no fixed abode.</p>
                }
              </li>
            ))}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <h2 className={styles.headingLg}>Person Info</h2>
          <p>Backend call failed with error: {data.error}</p>
        </div>
      )
    }
  }
}
