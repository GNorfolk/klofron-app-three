import Link from 'next/link'
import styles from '../../../styles/people.module.css'
import useSWR from 'swr'
import { useRouter } from 'next/router';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Family() {
  return (
    <div className={styles.container}>
      <Link href={`/people`}>← People List</Link>
      {listFamilyHouseholds()}
      {listFamilyMembers()}
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </div>
  )
}

export function listFamilyHouseholds() {
  const router = useRouter();
  if (router.isReady) {
    const { data, error } = useSWR('/api/people/list-family-households/' + router.query.id, fetcher)
    if (error) return <div className={styles.container}>Failed to load</div>
    if (!data) return <div className={styles.container}>Loading...</div>
    return (
      <div className={styles.container}>
        <h2 className={styles.headingLg}>Household Info</h2>
        {data.map(({ id, name, family_name }) => (
          <li className={styles.listItem} key={id}>
            <p>The {family_name} family own household {name}.</p>
          </li>
        ))}
      </div>
    )
  }
}

export function listFamilyMembers() {
  const router = useRouter();
  if (router.isReady) {
    const { data, error } = useSWR('/api/people/describe-family-members/' + router.query.id, fetcher)

    if (error) return <div className={styles.container}>Failed to load</div>
    if (!data) return <div className={styles.container}>Loading...</div>
    return (
      <div className={styles.container}>
        <h2 className={styles.headingLg}>Person Info</h2>
        {data.map(({ id, name, family_name, gender, age, household_name }) => (
          <li className={styles.listItem} key={id}>
            <p>{name} {family_name} is {gender} and {age} years old and lives at {household_name}.</p>
          </li>
        ))}
      </div>
    )
  }
}