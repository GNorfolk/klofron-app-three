import Link from 'next/link'
import styles from '../../styles/people.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import utilStyles from '../../styles/utils.module.css'

const queryClient = new QueryClient()

export default function House() {
  return (
    <div className={styles.container}>
      <QueryClientProvider client={queryClient}>
        <DescribeHouse />
        <ListHouseMembers />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </div>
  )
}

function DescribeHouse() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['houseData'],
      queryFn: () =>
        fetch('/api/people/describe-house/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div className={styles.container}>Loading...</div>
    if (error) return <div className={styles.container}>Failed to load</div>

    return (
      <div className={styles.container}>
        <h2 className={styles.headingLg}>House Info</h2>
        <ul className={styles.list}>
          {data.map(({ id, name, rooms, storage, food, wood, people }) => (
            <li className={styles.listItem} key={id}>
              <p>{name} has {rooms} rooms and contains {people} people, so has room for {rooms - people} more people.</p>
              <p>{name} has {food} food and {wood} wood in storage. It can hold {storage} items so has {storage - food - wood} space for more items.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}


function ListHouseMembers() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyMemberData'],
      queryFn: () =>
        fetch('/api/people/describe-house-members/' + router.query.id).then(
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
          {data.map(({ id, name, family_name, gender, age, house_name }) => (
            <li className={styles.listItem} key={id}>
              <p>{name} {family_name} is {gender} and {age} years old and lives at {house_name}.</p>
              <button onClick={
                () => {
                  getFood.mutate(id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                    if (!res.data.success && res.data.time_delta < 480000) {
                      document.getElementById(`${id}`).innerText = 'time_delta too low: ' + Math.floor((480000 - res.data.time_delta)/60000) + 'min ' + Math.floor(((480000 - res.data.time_delta) % 60000)/1000) + 'sec.'
                    } else if (!res.data.success && (res.data.storage < res.data.food + res.data.wood + 2)) {
                      document.getElementById(`${id}`).innerText = 'Not enough storage!'
                    } else {
                      document.getElementById(`${id}`).innerText = ' '
                    }
                  }})
                }
              } >Get Food</button>
              <button onClick={
                () => {
                  getWood.mutate(id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                    if (!res.data.success && res.data.time_delta < 480000) {
                      document.getElementById(`${id}`).innerText = 'time_delta too low: ' + Math.floor((480000 - res.data.time_delta)/60000) + 'min ' + Math.floor(((480000 - res.data.time_delta) % 60000)/1000) + 'sec.'
                    } else if (!res.data.success && res.data.food < 1) {
                      document.getElementById(`${id}`).innerText = 'food too low: ' + res.data.food
                    } else {
                      document.getElementById(`${id}`).innerText = ' '
                    }
                  }})
                }
              } >Get Wood</button>
              <small className={utilStyles.lightText} id={id}></small>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
