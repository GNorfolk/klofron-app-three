import Link from 'next/link'
import styles from '../../styles/people.module.css'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function People() {
  const { data, error } = useSWR('/api/people/list-people', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  return(
    <div className={styles.container}>
      <h2 className={styles.headingLg}>People</h2>
      <ul className={styles.list}>
        {data.map(({ id, name, family_name, family_id, gender, age, house_name }) => (
          <li className={styles.listItem} key={id}>
            <p>{name} <Link href={`/people/family/${family_id}`}>{family_name}</Link> is {gender} and {age} years old and lives at {house_name}.</p>
          </li>
        ))}
      </ul>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </div>
  )
}
