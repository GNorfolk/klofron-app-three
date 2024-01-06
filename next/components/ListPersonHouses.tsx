import styles from '../styles/main.module.css'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'

export default function ListPersonHouses({ queryClient, personId }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['moveHouseData' + personId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-person-houses/' + personId).then(
        (res) => res.json(),
      ),
  })

  const movePersonHouse = useMutation({
    mutationFn: (id) => {
      return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/move-person-house', {
        person_id: personId,
        house_id: id,
        food: 0,
        wood: 0
      })
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  if (data.success) {
    return (
      <div>
        <h2 className={styles.headingLg}>Move House</h2>
        <ul className={styles.list}>
          {data.data.map(({ id, name }) => (
            <li className={styles.listItem} key={id}>
              Move into {name}: <button onClick={
                () => {
                  movePersonHouse.mutate(id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                  }})
                }
              } >Move</button>
            </li>
          ))}
        </ul>
      </div>
    )
  } else {
    return (
      <div>
        <h2 className={styles.headingLg}>Move House</h2>
        <p>Backend call failed with error: {data.error}</p>
      </div>
    )
  }
}