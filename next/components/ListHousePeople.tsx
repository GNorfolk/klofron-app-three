import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'

export default function ListHousePeople({ queryClient, status, familyId = null }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyMemberData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person?house_id=' + router.query.id).then(
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

    return (
      <div>
        <h2 className={styles.headingLg}>Person Info</h2>
        <ul className={styles.list}>
          {data.map(({ person_id, person_name, person_family_id, person_family, person_gender, person_age, person_house, person_actions }) => (
            <li className={styles.listItem} key={person_id}>
              <p><Link href={"/person/" + person_id}>{person_name + " " + person_family.family_name}</Link> is {person_gender} and {person_age} years old and lives at {person_house.house_name}.</p>
              { person_actions[0]?.action_time_remaining ? (<><small className={styles.lightText}>{person_name} is performing an action completing in {person_actions[0].action_time_remaining}.</small><br /></>) : (<></>) }
              {
                status === "authenticated" && familyId == person_family_id ?
                <div>
                  <button onClick={
                    () => {
                      increaseFood.mutate(person_id, { onSettled: (res) => {
                        queryClient.invalidateQueries()
                        if (!res.data.success) {
                          document.getElementById("change-me-" + person_id).innerText = res.data.error
                        } else {
                          document.getElementById("change-me-" + person_id).innerText = ' '
                        }
                      }})
                    }
                  } >Get Food</button>
                  <button onClick={
                    () => {
                      increaseWood.mutate(person_id, { onSettled: (res) => {
                        queryClient.invalidateQueries()
                        if (!res.data.success) {
                          document.getElementById("change-me-" + person_id).innerText = res.data.error
                        } else {
                          document.getElementById("change-me-" + person_id).innerText = ' '
                        }
                      }})
                    }
                  } >Get Wood</button>
                  <button onClick={
                    () => {
                      increaseStorage.mutate(person_id, { onSettled: (res) => {
                        queryClient.invalidateQueries()
                        if (!res.data.success) {
                          document.getElementById("change-me-" + person_id).innerText = res.data.error
                        } else {
                          document.getElementById("change-me-" + person_id).innerText = ' '
                        }
                      }})
                    }
                  } >Increase Storage</button>
                  <button onClick={
                    () => {
                      increaseRooms.mutate(person_id, { onSettled: (res) => {
                        queryClient.invalidateQueries()
                        if (!res.data.success) {
                          document.getElementById("change-me-" + person_id).innerText = res.data.error
                        } else {
                          document.getElementById("change-me-" + person_id).innerText = ' '
                        }
                      }})
                    }
                  } >Increase Rooms</button>
                  <button onClick={
                    () => {
                      createHouse.mutate(person_id, { onSettled: (res) => {
                        queryClient.invalidateQueries()
                        if (!res.data.success) {
                          document.getElementById("change-me-" + person_id).innerText = res.data.error
                        } else {
                          document.getElementById("change-me-" + person_id).innerText = ' '
                        }
                      }})
                    }
                  } >Create House</button>
                  <small className={styles.lightText} id={'change-me-' + person_id}></small>
                </div>
                :
                <></>
              }
            </li>
          ))}
        </ul>
      </div>
    )
  }
}