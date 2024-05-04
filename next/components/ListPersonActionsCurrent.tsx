import styles from '../styles/main.module.css'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'

export default function ListPersonActionsCurrent({ queryClient, personId }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['personCurentActionsData' + personId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/action?person_id=' + personId + '&limit=1&current=true').then(
        (res) => res.json(),
      ),
  })

  const cancelAction = useMutation({
    mutationFn: (id) => {
      return axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/action/' + id, {
        action: "cancel"
      })
    },
  })

  if (isLoading) return (
    <div>
      <h3 className={styles.headingMd}>Current Action</h3>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  return (
    <div>
      <h3 className={styles.headingMd}>Current Action</h3>
      <ul className={styles.list}>
        { data.length > 0 ? 
          data.map(({ action_id, action_type_name, action_started_time_ago }) => (
            <li className={styles.listItem} key={action_id}>
              <p>Action with id {action_id} of type {action_type_name} was started {action_started_time_ago} ago.</p>
              <button onClick={
                () => {
                    cancelAction.mutate(action_id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                  }})
                }
              } >Cancel Action</button>
            </li>
          )) : <p>No actions currently in progress!</p> }
      </ul>
    </div>
  )
}