import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'

export default function ListHousePeople({ queryClient }) {
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
                <p><Link href={"/person/" + id}>{name + " " + family_name}</Link> is {gender} and {age} years old and lives at {house_name}.</p>
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