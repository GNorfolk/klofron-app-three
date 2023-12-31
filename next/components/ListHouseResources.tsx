import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'

export default function ListHouseTrades({ queryClient }) {
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