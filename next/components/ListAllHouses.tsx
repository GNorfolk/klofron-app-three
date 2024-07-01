import styles from '../styles/main.module.css'
import { useQuery } from '@tanstack/react-query'

export default function ListAllHouses() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['housesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <div>
      <h2 className="text-2xl leading-snug my-4 mx-0">Houses</h2>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  return (
    <div>
      <h2 className="text-2xl leading-snug my-4 mx-0">Houses</h2>
      <ul className="list-none p-0 m-0">
        {data.map(({ house_id, house_address, house_rooms, house_storage, house_food, house_wood }) => (
          <li className="mt-0 mx-0 mb-5" key={house_id}>
            <p>The {house_address.house_address_number + " " + house_address.house_address_road.house_road_name} house has {house_rooms} rooms and {house_storage} storage. It has {house_food.resource_volume} food and {house_wood.resource_volume} wood in storage.</p>
          </li>
        ))}
      </ul>
    </div>
  )
}