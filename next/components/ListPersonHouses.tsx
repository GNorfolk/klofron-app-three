import styles from '../styles/main.module.css'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'

export default function ListPersonHouses({ queryClient, personId, familyId, houseId }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['moveHouseData' + personId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house?family_id=' + familyId + '&exclude_ids=' + houseId).then(
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

  if (isLoading) return (
    <div>
      <h2 className={styles.headingLg}>Move House</h2>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  if (data.length > 0) {
    return (
      <div>
        <h2 className={styles.headingLg}>Move House</h2>
        <ul className={styles.list}>
          {
            data.map(({ house_id, house_name }) => (
              <li className={styles.listItem} key={house_id}>
                Move into {house_name}: <button onClick={
                  () => {
                    movePersonHouse.mutate(house_id, {
                      onSettled: (data, error, variables, context) => {
                        queryClient.invalidateQueries()
                        if (error) {
                          document.getElementById("change-me-" + house_id).innerText = error.toString()
                        } else if (!data.data.status) {
                          document.getElementById("change-me-" + house_id).innerText = data.data.error
                        } else {
                          document.getElementById("change-me-" + house_id).innerText = ' '
                        }
                      }
                    })
                  }
                } >Move</button>
                <small className={styles.lightText} id={'change-me-' + house_id}></small>
              </li>
            ))
          }
        </ul>
      </div>
    )
  } else {
    return (
      <div>
        <h2 className={styles.headingLg}>Move House</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <p>Person has no houses they can move into.</p>
          </li>
        </ul>
      </div>
    )
  }
}