import { UsersIcon, HandPlatterIcon, TreesIcon, BuildingIcon, BoxIcon, BedIcon, WarehouseIcon, TruckIcon } from '../ui/icon'
import { HeaderOne } from '../ui/header'

export function HouseListing({ houseData }) {
  return (
    <main>
      <HeaderOne>Houses</HeaderOne>
      { houseData.length > 0 ? houseData.map(({ house_id, house_address, house_food, house_wood, house_people }) => (
        <a href={`/house/${house_id}`} className="p-6 pt-2 pb-2">
          <h3 className="text-xl font-semibold text-gray-200">{house_address.house_address_number + " " + house_address.house_address_road.house_road_name}</h3>
          <div className="grid grid-cols-3">
            <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
              <UsersIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
              <span className='whitespace-nowrap'>{house_people.length} people</span>
            </div>
            <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
              <HandPlatterIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
              <span className='whitespace-nowrap'>{house_food.resource_volume} Food</span>
            </div>
            <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <TreesIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
              <span className='whitespace-nowrap'>{house_wood.resource_volume} Wood</span>
            </div>
          </div>
        </a>
      )) :
        <a className="p-6 pt-2 pb-2">
          <h3 className="text-xl font-semibold text-gray-200">There are no houses to show!</h3>
        </a>
      }
    </main>
  )
}

export function HouseInfo({ houseData }) {
  return (
    <main>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <BedIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_rooms} Bed</span>
        </div>
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <UsersIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_people.length} people</span>
        </div>
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <BuildingIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_rooms - houseData.house_people.length} Room</span>
        </div>
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <HandPlatterIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_food.resource_volume} Food</span>
        </div>
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <TreesIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_wood.resource_volume} Wood</span>
        </div>
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <TruckIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>0 Trade</span>
        </div>
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <WarehouseIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_storage} Storage</span>
        </div>
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <BoxIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_storage - houseData.house_food.resource_volume - houseData.house_wood.resource_volume} Capacity</span>
        </div>
      </div>
    </main>
  )
}