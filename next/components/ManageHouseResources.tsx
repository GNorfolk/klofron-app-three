import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

export default function ManageHouseResources() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['houseResourceData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Resource Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>Resource Info</h2>
        <p>{data.house_name} has {data.house_food.resource_volume} food and {data.house_wood.resource_volume} wood in storage!</p>
        { data.house_people.map(({ person_name, person_food, person_wood }) => (
          <p>{person_name} has {person_food.resource_volume} food and {person_wood.resource_volume} wood.</p>
        ))}
      </div>
    )
  }
}