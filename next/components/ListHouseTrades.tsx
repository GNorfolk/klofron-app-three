import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

export default function ListHouseTrades() {
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