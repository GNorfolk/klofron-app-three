import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'

export default function ListHouseResources({ queryClient, userId = null }) {
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

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Resource Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>Resource Info</h2>
        <p>{data.house_name} has {data.house_food.resource_volume} food and {data.house_wood.resource_volume} wood in storage!</p>
        {
          userId === data.house_family.family_user_id ?
          <div>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <p>Wood: {data.house_wood.resource_volume} in storage! <button onClick={
                  () => {
                      decreaseWood.mutate(data.house_id, { onSettled: (res) => {
                      queryClient.invalidateQueries()
                    }})
                  }
                } >Decrease Wood</button></p>
              </li>
              <li className={styles.listItem}>
                <p>Food: {data.house_food.resource_volume} in storage! <button onClick={
                  () => {
                      decreaseFood.mutate(data.house_id, { onSettled: (res) => {
                      queryClient.invalidateQueries()
                    }})
                  }
                } >Decrease Food</button></p>
              </li>
            </ul>
            <p>Go to <Link href={`/house/${router.query.id}/resource`}>Resource Management</Link> page.</p>
          </div>
          :
          <></>
        }
      </div>
    )
  }
}