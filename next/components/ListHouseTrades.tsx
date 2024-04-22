import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

export default function ListHouseTrades() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['houseTradesData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/trade?house_id=' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Trade Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    if (data.length > 0) {
      return (
        <div>
          <h2 className={styles.headingLg}>Trade Info</h2>
          <ul className={styles.list}>
            {data.map(({ trade_id, trade_offered_type, trade_offered_volume, trade_requested_type, trade_requested_volume }) => (
              <li className={styles.listItem} key={trade_id}>
                <p>Trade with id {trade_id} offers {trade_offered_volume} {trade_offered_type} in return for {trade_requested_volume} {trade_requested_type}.</p>
              </li>
            ))}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <h2 className={styles.headingLg}>Trade Info</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <p>No trades active at this house.</p>
            </li>
          </ul>
        </div>
      )
    }
  }
}