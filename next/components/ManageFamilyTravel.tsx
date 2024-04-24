import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

export default function ManageFamilyTravel({ familyId}) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyTravelData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person?family_id=' + familyId).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Travel Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>Travel Info</h2>
        { data.map(({ person_name, person_house_id, person_house }) => (
          person_house_id ? <p>{person_name} lives at {person_house.house_name}.</p> : <p>{person_name} is unhoused.</p>
        ))}
      </div>
    )
  }
}