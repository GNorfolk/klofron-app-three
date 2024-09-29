import { UsersIcon, HandPlatterIcon, TreesIcon, BuildingIcon, BoxIcon, BedIcon, WarehouseIcon, TruckIcon } from '../ui/icon'
import { HeaderOne, HeaderThree } from '../ui/header'
import { DivIconInfo } from '../ui/div'
import Link from 'next/link'

export function HouseListing({ houseData }) {
  return (
    <main>
      <HeaderOne>Houses</HeaderOne>
      { houseData.length > 0 ? houseData.map(({ house_id, house_address, house_food, house_wood, house_people }) => (
        <Link href={`/house/${house_id}`}>
          <a className="p-6 pt-2 pb-2">
            <HeaderThree>{house_address.house_address_number + " " + house_address.house_address_road.house_road_name}</HeaderThree>
            <div className="grid grid-cols-3">
              <DivIconInfo>
                <UsersIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                <span className='whitespace-nowrap'>{house_people.length} people</span>
              </DivIconInfo>
              <DivIconInfo>
                <HandPlatterIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                <span className='whitespace-nowrap'>{house_food.resource_volume} Food</span>
              </DivIconInfo>
              <DivIconInfo>
                <TreesIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                <span className='whitespace-nowrap'>{house_wood.resource_volume} Wood</span>
              </DivIconInfo>
            </div>
          </a>
        </Link>
      )) :
        <a className="p-6 pt-2 pb-2">
          <HeaderThree>There are no houses to show!</HeaderThree>
        </a>
      }
    </main>
  )
}

export function HouseInfo({ houseData }) {
  return (
    <main>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
        <DivIconInfo>
          <BedIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_rooms} Bed</span>
        </DivIconInfo>
        <DivIconInfo>
          <UsersIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_people.length} people</span>
        </DivIconInfo>
        <DivIconInfo>
          <BuildingIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_rooms - houseData.house_people.length} Room</span>
        </DivIconInfo>
        <DivIconInfo>
          <HandPlatterIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_food.resource_volume} Food</span>
        </DivIconInfo>
        <DivIconInfo>
          <TreesIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_wood.resource_volume} Wood</span>
        </DivIconInfo>
        <DivIconInfo>
          <TruckIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>0 Trade</span>
        </DivIconInfo>
        <DivIconInfo>
          <WarehouseIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_storage} Storage</span>
        </DivIconInfo>
        <DivIconInfo>
          <BoxIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
          <span className='whitespace-nowrap'>{houseData.house_storage - houseData.house_food.resource_volume - houseData.house_wood.resource_volume} Capacity</span>
        </DivIconInfo>
      </div>
    </main>
  )
}