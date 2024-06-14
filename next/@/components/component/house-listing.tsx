import Link from 'next/link'
import { UsersIcon, HandPlatterIcon, TreesIcon } from '../ui/icon'

export function HouseListing({ houseData }) {
  return (
    <main>
      <h2 className="p-6 text-4xl">Houses</h2>
      { houseData.length > 0 ? houseData.map(({ house_id, house_address, house_food, house_wood, house_people }) => (
        <a href={`/house/${house_id}`} className="p-6 pt-2 pb-2">
          <h3 className="text-xl font-semibold">{house_address.house_address_number + " " + house_address.house_address_road.house_road_name}</h3>
          <div className="flex">
            <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
              <UsersIcon className="w-5 h-5 mr-2" />
              <span>{house_people.length} members</span>
            </div>
            <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
              <HandPlatterIcon className="w-5 h-5 mr-2" />
              <span>{house_food.resource_volume} Food</span>
            </div>
            <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <TreesIcon className="w-5 h-5 mr-2" />
              <span>{house_wood.resource_volume} Wood</span>
            </div>
          </div>
        </a>
      )) :
        <a className="p-6 pt-2 pb-2">
          <h3 className="text-xl font-semibold">There are no houses to show!</h3>
        </a>
      }
    </main>
  )
}