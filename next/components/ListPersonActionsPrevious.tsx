import styles from '../styles/main.module.css'
import { useQuery } from '@tanstack/react-query'

export default function ListPersonActionsPrevious({ personId }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['personPreviousActionsData' + personId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/action?person_id=' + personId + '&limit=5&current=false').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  if (data.length > 0) {
    return (
      <div>
        <h3 className={styles.headingMd}>Previous Actions</h3>
        <ul className={styles.list}>
          {data.map(({ action_id, action_type_name, action_started_time_ago, action_finish_reason }) => (
            <li className={styles.listItem} key={action_id}>
              <p>Action with id {action_id} of type {action_type_name} was started {action_started_time_ago} ago and finished with reason {action_finish_reason}.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  } else {
    return (
      <div>
        <h3 className={styles.headingMd}>Previous Actions</h3>
        <ul className={styles.list}>
            <li className={styles.listItem}>
              <p>This person has no past actions initiated.</p>
            </li>
        </ul>
      </div>
    )
  }
}