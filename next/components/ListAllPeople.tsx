import styles from '../styles/main.module.css'
import { useQuery } from '@tanstack/react-query'

export default function ListAllPeople() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['listAllPeopleData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <div>
      <h2 className={styles.headingLg}>People</h2>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  console.log(data)

  return (
    <div>
      <h2 className={styles.headingLg}>People</h2>
      <ul className={styles.list}>
        {
          data.map(({ person_id, person_name, person_family, person_age }) => (
            <li className={styles.listItem} key={person_id}>
              <p>{person_name} {person_family.family_name} is {person_age} years old.</p>
            </li>
          ))
        }
      </ul>
    </div>
  )
}