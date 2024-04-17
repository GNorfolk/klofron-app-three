import styles from '../styles/main.module.css'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function ListAllFamilies({ userId = null }) {
  const fetchQuery = userId ? '/v2/family?user_id=' + userId : '/v2/family'
  const { isLoading, error, data } = useQuery({
    queryKey: ['familiesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + fetchQuery).then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

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