import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import Layout from '../../components/layout'
import { FormEventHandler, useState } from "react"

const queryClient = new QueryClient()

export default function House() {
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <DescribeHouse />
        <ListHousePeople />
        <ListHouseTrades />
        <ManageResources />
        <RenameHouse />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/family">← Back to home</Link>
      </div>
    </Layout>
  )
}

function DescribeHouse() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['houseData' + router.query.id],
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

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    if (data.success) {
      return (
        <div>
          <h2 className={styles.headingLg}>House Info</h2>
          <ul className={styles.list}>
            {data.data.map(({ id, name, rooms, storage, food, wood, food_in_trade, wood_in_trade, people }) => (
              <li className={styles.listItem} key={id}>
                <p>{name} has {rooms} rooms and contains {people} people, so has room for {rooms - people} more people.</p>
                <p>{name} has {food} food and {wood} wood in storage, and {food_in_trade} food and {wood_in_trade} wood in trade. It can hold {storage} items so has {storage - food - wood - food_in_trade - wood_in_trade} space for more items.</p>
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
                <small className={styles.lightText} id={'change-me-two-' + id}></small>
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

function ListHousePeople() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyMemberData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-house-people/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    const  increaseFood  = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/increase-food/' + id, null, { params: {infinite: 0} })
      },
    })

    const  increaseWood  = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/increase-wood/' + id, null, { params: {infinite: 0} })
      },
    })

    const increaseStorage = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/modify-house/increase-storage/' + id, null, { params: {infinite: 0} })
      },
    })

    const increaseRooms = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/modify-house/increase-rooms/' + id, null, { params: {infinite: 0} })
      },
    })

    const createHouse = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/create-house/' + id, null, { params: {infinite: 0} })
      },
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    if (data.success) {
      return (
        <div>
          <h2 className={styles.headingLg}>Person Info</h2>
          <ul className={styles.list}>
            {data.data.map(({ id, name, family_name, gender, age, house_name, action_time }) => (
              <li className={styles.listItem} key={id}>
                <p>{name} {family_name} is {gender} and {age} years old and lives at {house_name}.</p>
                { action_time ? (<><small className={styles.lightText}>{name} is performing an action completing in {action_time}.</small><br /></>) : (<></>) }
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
                <small className={styles.lightText} id={'change-me-' + id}></small>
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

function ListHouseTrades() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['houseTradesData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-house-trades/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    if (data.success) {
      return (
        <div>
          <h2 className={styles.headingLg}>Trade Info</h2>
          <ul className={styles.list}>
            {data.data.map(({ id, offered_type_name, offered_volume, requested_type_name, requested_volume }) => (
              <li className={styles.listItem} key={id}>
                <p>Trade with id {id} offers {offered_volume} {offered_type_name} in return for {requested_volume} {requested_type_name}.</p>
              </li>
            ))}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <h2 className={styles.headingLg}>Trade Info</h2>
          <p>Backend call failed with error: {data.error}</p>
        </div>
      )
    }
  }
}

function ManageResources() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['resourceData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/describe-house-resources/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    const decreaseWood = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/decrease-wood/' + id)
      },
    })

    const decreaseFood = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/decrease-food/' + id)
      },
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    if (data.success) {
      return (
        <div>
          <h2 className={styles.headingLg}>Manage Resources</h2>
          <p>{data.data[0].name} has {data.data[0].food} food and {data.data[0].wood} wood in storage!</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <p>Wood: {data.data[0].wood} in storage!</p>
              <button onClick={
                () => {
                    decreaseWood.mutate(data.data[0].id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                  }})
                }
              } >Decrease Wood</button>
            </li>
            <li className={styles.listItem}>
              <p>Food: {data.data[0].food} in storage!</p>
              <button onClick={
                () => {
                    decreaseFood.mutate(data.data[0].id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                  }})
                }
              } >Decrease Food</button>
            </li>
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <h2 className={styles.headingLg}>Manage Resources</h2>
          <p>Backend call failed with error: {data.error}</p>
        </div>
      )
    }
  }
}

function RenameHouse() {
  const router = useRouter()
  if (router.isReady) {
    const [houseInfo, sethouseInfo] = useState({ name: "" })
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();
      return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/rename-house/' + router.query.id, {
        name: houseInfo.name
      }).then((value) => {
        queryClient.invalidateQueries()
      })
    };

    return (
      <div>
        <h2 className={styles.headingLg}>Rename House</h2>
        <ul className={styles.list}>
          <form onSubmit={handleSubmit}>
            <input
              value={houseInfo.name}
              onChange={({ target }) =>
                sethouseInfo({ ...houseInfo, name: target.value })
              }
              placeholder="Insert name here"
            />
            <input type="submit" value="Rename" />
          </form>
        </ul>
      </div>
    )
  }
}