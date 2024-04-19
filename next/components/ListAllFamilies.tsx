import styles from '../styles/main.module.css'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'

export default function ListAllFamilies({ queryClient = null, userId = null }) {
  const fetchQuery = userId ? '/v2/family?user_id=' + userId : '/v2/family'
  const { isLoading, error, data } = useQuery({
    queryKey: ['familiesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + fetchQuery).then(
        (res) => res.json(),
      ),
  })

  const createFamily = useMutation({
    mutationFn: (id) => {
      return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/family', {
        family_name: "someFamilyName",
        family_user_id: id
      })
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  if (userId) {
    return (
      <div>
      <h2 className={styles.headingLg}>Families</h2>
      <ul className={styles.list}>
        {data.map(({ family_id, family_name, family_people }) => (
          <li className={styles.listItem} key={family_id}>
            { family_people.length > 0 ? <p>The <Link href={`/family/${family_id}`}>{family_name}</Link> family.</p> : <></> }
          </li>
        ))}
      </ul>
      <h2 className={styles.headingLg}>Create Family</h2>
      <button onClick={
        () => {
          createFamily.mutate(userId, {
            onSettled: (data, error, variables, context) => {
              queryClient.invalidateQueries()
              if (error) {
                document.getElementById("change-me-" + userId).innerText = error.toString()
              } else {
                document.getElementById("change-me-" + userId).innerText = ' '
              }
            }
          })
        }
      } >Create Family</button>
      <small className={styles.lightText} id={'change-me-' + userId}></small>
    </div>
    )
  } else {
    return (
      <div>
        <h2 className={styles.headingLg}>Families</h2>
        <ul className={styles.list}>
          {data.map(({ family_id, family_name, family_people }) => (
            <li className={styles.listItem} key={family_id}>
              { family_people.length > 0 ? <p>The <Link href={`/family/${family_id}`}>{family_name}</Link> family.</p> : <></> }
            </li>
          ))}
        </ul>
      </div>
    )
  }
}