import Link from 'next/link'
import styles from '../../styles/people.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import utilStyles from '../../styles/utils.module.css'

const queryClient = new QueryClient()

export default function Family() {
  return (
    <div className={styles.container}>
      <QueryClientProvider client={queryClient}>
        <DescribeFamily />
        <ListFamilyPeople />
        <ListFamilyHouses />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </div>
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

    if (isLoading) return <div className={styles.container}>Loading...</div>
    if (error) return <div className={styles.container}>Failed to load</div>

    return (
      <div className={styles.container}>
        {data.map(({ name }) => (
          <h1 className={styles.heading2Xl}>The {name} family.</h1>
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

    if (isLoading) return <div className={styles.container}>Loading...</div>
    if (error) return <div className={styles.container}>Failed to load</div>

    return (
      <div className={styles.container}>
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

    if (isLoading) return <div className={styles.container}>Loading...</div>
    if (error) return <div className={styles.container}>Failed to load</div>

    return (
      <div className={styles.container}>
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
