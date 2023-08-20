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
        <ListHousePeople />
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
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/describe-house/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    const createPerson = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/create-person/' + id)
      },
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
              <button onClick={
                () => {
                  createPerson.mutate(id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                    if (!res.data.success) {
                      document.getElementById("change-me-two-" + id).innerText = res.data.error
                    } else {
                      document.getElementById("change-me-two-" + id).innerText = ' '
                    }
                  }})
                }
              } >Create Person</button>
              <small className={utilStyles.lightText} id={'change-me-two-' + id}></small>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

function ListHousePeople() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyMemberData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-house-people/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    const  increaseFood  = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/increase-food/' + id)
      },
    })

    const  increaseWood  = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/increase-wood/' + id)
      },
    })

    const increaseStorage = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/modify-house/increase-storage/' + id)
      },
    })

    const increaseRooms = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/modify-house/increase-rooms/' + id)
      },
    })

    const createHouse = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/create-house/' + id)
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
                   increaseFood.mutate(id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                    if (!res.data.success) {
                      document.getElementById("change-me-" + id).innerText = res.data.error
                    } else {
                      document.getElementById("change-me-" + id).innerText = ' '
                    }
                  }})
                }
              } >Get Food</button>
              <button onClick={
                () => {
                   increaseWood.mutate(id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                    if (!res.data.success) {
                      document.getElementById("change-me-" + id).innerText = res.data.error
                    } else {
                      document.getElementById("change-me-" + id).innerText = ' '
                    }
                  }})
                }
              } >Get Wood</button>
              <button onClick={
                () => {
                   increaseStorage.mutate(id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                    if (!res.data.success) {
                      document.getElementById("change-me-" + id).innerText = res.data.error
                    } else {
                      document.getElementById("change-me-" + id).innerText = ' '
                    }
                  }})
                }
              } >Increase Storage</button>
              <button onClick={
                () => {
                   increaseRooms.mutate(id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                    if (!res.data.success) {
                      document.getElementById("change-me-" + id).innerText = res.data.error
                    } else {
                      document.getElementById("change-me-" + id).innerText = ' '
                    }
                  }})
                }
              } >Increase Rooms</button>
              <button onClick={
              () => {
                  createHouse.mutate(id, { onSettled: (res) => {
                  queryClient.invalidateQueries()
                  if (!res.data.success) {
                    document.getElementById("change-me-" + id).innerText = res.data.error
                  } else {
                    document.getElementById("change-me-" + id).innerText = ' '
                  }
                }})
              }
            } >Create House</button>
              <small className={utilStyles.lightText} id={'change-me-' + id}></small>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
