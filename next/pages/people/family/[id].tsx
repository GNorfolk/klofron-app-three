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
              <button onClick={handleFoodClick}>Get Food</button>
              <button onClick={handleWoodClick}>Get Wood</button>
              <button onClick={handleCoinClick}>Get Coin</button>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export function handleFoodClick() {
  console.log('food')
}

export function handleWoodClick() {
  console.log('wood')
}

export function handleCoinClick() {
  console.log('coin')
}