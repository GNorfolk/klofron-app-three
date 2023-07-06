import Link from 'next/link'
import styles from '../../../styles/people.module.css'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import useSWRMutation from 'swr/mutation'

async function sendRequest(url, { arg }: { arg: { username: string }}) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  }).then(res => res.json())
}

function Button() {
  const { trigger, isMutating } = useSWRMutation('/api/people/hunt', sendRequest)
  return (
    <button
      disabled={isMutating}
      onClick={async () => {
        try {
          const result = await trigger({ username: 'why' })
        } catch (e) {
          console.log("error")
        }
      }}
    >Get Food</button>
  )
}

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
  const router = useRouter()
  const fetcher = (...args) => fetch(...args).then((res) => res.json())
  if (router.isReady) {
    const { data, error } = useSWR('/api/people/describe-family-households/' + router.query.id, fetcher)
    if (error) return <div className={styles.container}>Failed to load</div>
    if (!data) return <div className={styles.container}>Loading...</div>
    return (
      <div className={styles.container}>
        <h2 className={styles.headingLg}>Household Info</h2>
        <ul className={styles.list}>
          {data.map(({ id, name, family_name, food, wood, coin }) => (
            <li className={styles.listItem} key={id}>
              <p>The {family_name} family own household {name}.</p>
              <p>Household {name} holds {food} food, {wood} wood, and {coin} coin.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export function listFamilyMembers() {
  const router = useRouter();
  const fetcher = (...args) => fetch(...args).then((res) => res.json())
  if (router.isReady) {
    const { data, error } = useSWR('/api/people/describe-family-members/' + router.query.id, fetcher)

    if (error) return <div className={styles.container}>Failed to load</div>
    if (!data) return <div className={styles.container}>Loading...</div>
    return (
      <div className={styles.container}>
        <h2 className={styles.headingLg}>Person Info</h2>
        <ul className={styles.list}>
          {data.map(({ id, name, family_name, gender, age, household_name }) => (
            <li className={styles.listItem} key={id}>
              <p>{name} {family_name} is {gender} and {age} years old and lives at {household_name}.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
