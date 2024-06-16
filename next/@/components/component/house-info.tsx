import { UsersIcon, HandPlatterIcon, TreesIcon, BuildingIcon, BoxIcon, BedIcon, WarehouseIcon, TruckIcon } from '../ui/icon'

export function HouseInfo({ houseData }) {
  return (
    <main>
      <div className="flex">
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <BedIcon className="w-5 h-5 mr-2" />
          <span>{houseData.house_rooms} Rooms</span>
        </div>
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <UsersIcon className="w-5 h-5 mr-2" />
          <span>{houseData.house_people.length} People</span>
        </div>
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <BuildingIcon className="w-5 h-5 mr-2" />
          <span>{houseData.house_wood.resource_volume} Vacancies</span>
        </div>
      </div>
      <div className="flex">
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <HandPlatterIcon className="w-5 h-5 mr-2" />
          <span>{houseData.house_food.resource_volume} Food</span>
        </div>
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <TreesIcon className="w-5 h-5 mr-2" />
          <span>{houseData.house_wood.resource_volume} Wood</span>
        </div>
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <TruckIcon className="w-5 h-5 mr-2" />
          <span>0 Trade</span>
        </div>
      </div>
      <div className="flex">
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <WarehouseIcon className="w-5 h-5 mr-2" />
          <span>{houseData.house_storage} Storage</span>
        </div>
        <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
          <BoxIcon className="w-5 h-5 mr-2" />
          <span>{houseData.house_storage - houseData.house_food.resource_volume - houseData.house_wood.resource_volume} Capacity</span>
        </div>
      </div>
    </main>
  )
}