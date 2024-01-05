import styles from '../styles/main.module.css'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function ListFamilyHouses({ familyId }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['familyHouseData' + familyId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house?family_id=' + familyId).then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  return (
    <div>
      <h2 className={styles.headingLg}>House Info</h2>
      <ul className={styles.list}>
        {data.map(({ house_id, house_name, house_family, house_food, house_wood }) => (
          <li className={styles.listItem} key={house_id}>
            <p>The {house_family.family_name} family own <Link href={`/house/${house_id}`}>{house_name}</Link> which holds {house_food.resource_volume} food and {house_wood.resource_volume} wood.</p>
          </li>
        ))}
      </ul>
    </div>
  )
}