import styles from '../styles/main.module.css'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'


export default function ListAllEntities({ queryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      <h1 className={styles.heading2Xl}>Index</h1>
      <ListAllFamilies />
      <ListAllHouses />
      <ListAllPeople />
    </QueryClientProvider>
  )
}

export function ListAllFamilies({ queryClient = null, userId = null }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['familiesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <div>
      <h2 className={styles.headingLg}>Families</h2>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  return (
    <div>
      <h2 className={styles.headingLg}>Families</h2>
      <ul className={styles.list}>
        { data.map(({ family_id, family_name }) => (
          <li className={styles.listItem} key={family_id}>
            <p>The <Link href={`/family/${family_id}`}>{family_name}</Link> family.</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ListAllHouses() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['housesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <div>
      <h2 className={styles.headingLg}>Houses</h2>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  return (
    <div>
      <h2 className={styles.headingLg}>Houses</h2>
      <ul className={styles.list}>
        {data.map(({ house_id, house_address, house_rooms, house_storage, house_food, house_wood }) => (
          <li className={styles.listItem} key={house_id}>
            <p>The {house_address.house_address_number + " " + house_address.house_address_road.house_road_name} house has {house_rooms} rooms and {house_storage} storage. It has {house_food.resource_volume} food and {house_wood.resource_volume} wood in storage.</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ListAllPeople() {
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