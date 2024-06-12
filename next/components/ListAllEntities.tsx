import styles from '../styles/main.module.css'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { BoxLayout } from '../@/components/component/box-layout'

export default function ListAllEntities({ queryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BoxLayout left={
        <div>
          <ListAllFamilies />
          <br />
          <ListAllHouses />
        </div>
      } right={
        <ListAllPeople />
      }/>
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
      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
        <h2 className="p-6 text-4xl">Families</h2>
        <p>Loading...</p>
      </div>
    </div>
  )
  if (error) return <div>Failed to load</div>

  return (
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
      <h2 className="p-6 text-4xl">Families</h2>
      { data.map(({ family_id, family_name, family_people, family_houses }) => (
      <div className="p-6 pt-2 pb-2">
        <h3 className="text-xl font-semibold">The <Link href={`/family/${family_id}`}>{family_name}</Link> family</h3>
        <div className="flex">
          <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
            <UsersIcon className="w-5 h-5 mr-2" />
            <span>{family_people.length} members</span>
          </div>
          <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <HouseIcon className="w-5 h-5 mr-2" />
            <span>{family_houses.length} houses</span>
          </div>
        </div>
      </div>
      ))}
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
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
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
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
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

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function HouseIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" />
      <path d="M9 21V12H15V21" />
    </svg>
  )
}