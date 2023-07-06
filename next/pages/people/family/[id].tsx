import Link from 'next/link'
import styles from '../../../styles/people.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import axios from 'axios'

const queryClient = new QueryClient()

export default function Family() {
  return (
    <div className={styles.container}>
      <Link href={`/people`}>← People List</Link>
      <QueryClientProvider client={queryClient}>
        <ListFamilyMembers />
        <ListFamilyHouseholds />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </div>
  )
}

function ListFamilyHouseholds() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyHouseholdData'],
      queryFn: () =>
        fetch('/api/people/describe-family-households/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div className={styles.container}>Loading...</div>
    if (error) return <div className={styles.container}>Failed to load</div>

    return (
      <div className={styles.container}>
        <h2 className={styles.headingLg}>Household Info</h2>
        <ul className={styles.list}>
          {data.map(({ id, name, family_name, food, wood, coin }) => (
            <li className={styles.listItem} key={id}>
              <p>The {family_name} family own household {name}.</p>
              <p>Household {name} holds {food} food, {wood} wood, and {coin} coin.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

function ListFamilyMembers() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyMemberData'],
      queryFn: () =>
        fetch('/api/people/describe-family-members/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    const getFood = useMutation({
      mutationFn: (id) => {
        return axios.post('/api/people/get-food/' + id)
      },
    })

    const getWood = useMutation({
      mutationFn: (id) => {
        return axios.post('/api/people/get-wood/' + id)
      },
    })

    if (isLoading) return <div className={styles.container}>Loading...</div>
    if (error) return <div className={styles.container}>Failed to load</div>

    return (
      <div className={styles.container}>
        <h2 className={styles.headingLg}>Person Info</h2>
        <ul className={styles.list}>
          {data.map(({ id, name, family_name, gender, age, household_name }) => (
            <li className={styles.listItem} key={id}>
              <p>{name} {family_name} is {gender} and {age} years old and lives at {household_name}.</p>
              <button onClick={() => { getFood.mutate(id) }} >Get Food</button>
              <button onClick={() => { getWood.mutate(id) }} >Get Wood</button>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
