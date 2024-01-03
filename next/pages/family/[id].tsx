import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Layout from '../../components/Layout'

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
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h1 className={styles.heading2Xl} key={data.family_id}>The {data.family_name} family.</h1>
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
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house?family_id=' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>House Info</h2>
        <ul className={styles.list}>
          {data.map(({ house_id, house_name, house_family, house_food, house_wood }) => (
            <li className={styles.listItem} key={house_id}>
              <p>The {house_family.family_name} family own <Link href={`/house/${house_id}`}>{house_name}</Link> which holds {house_food.resource_volume} food and {house_wood.resource_volume} wood.</p>
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
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person?family_id=' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>Person Info</h2>
        <ul className={styles.list}>
          {data.map(({ person_id, person_name, person_family, person_gender, person_age, person_house }) => (
            <li className={styles.listItem} key={person_id}>
              <p><Link href={"/person/" + person_id}>{person_name + ' ' + person_family.family_name}</Link> is {person_gender} and {person_age} years old and lives at {person_house.house_name}.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
