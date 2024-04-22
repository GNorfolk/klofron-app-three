import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'

export default function ListHouseResources({ queryClient, status, userId = null }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['resourceData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house/' + router.query.id).then(
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

    return (
      <div>
        <h2 className={styles.headingLg}>Resource Info</h2>
        <p>{data.house_name} has {data.house_food} food and {data.house_wood} wood in storage!</p>
        {
          status === "authenticated" && userId == data.house_user_id ?
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <p>Wood: {data.house_wood} in storage! <button onClick={
                () => {
                    decreaseWood.mutate(data.house_id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                  }})
                }
              } >Decrease Wood</button></p>
            </li>
            <li className={styles.listItem}>
              <p>Food: {data.house_food} in storage! <button onClick={
                () => {
                    decreaseFood.mutate(data.house_id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                  }})
                }
              } >Decrease Food</button></p>
            </li>
          </ul>
          :
          <></>
        }
      </div>
    )
  }
}