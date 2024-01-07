import styles from '../styles/main.module.css'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function ListFamilyPeople({ familyId }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['familyMemberData' + familyId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person?family_id=' + familyId).then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  if (data.length > 0) {
    return (
      <div>
        <h2 className={styles.headingLg}>Person Info</h2>
        <ul className={styles.list}>
          {data.map(({ person_id, person_name, person_family, person_gender, person_age, person_house }) => (
            <li className={styles.listItem} key={person_id}>
              <p><Link href={"/person/" + person_id}>{person_name + ' ' + person_family.family_name}</Link> is {person_gender} and {person_age} years old and lives at {person_house.house_name}.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  } else {
    return (
      <div>
        <h2 className={styles.headingLg}>Person Info</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <p>This family does not have any people in it.</p>
          </li>
        </ul>
      </div>
    )
  }
}