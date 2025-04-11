import { UsersIcon, HandPlatterIcon, TreesIcon, BuildingIcon, BoxIcon, BedIcon, WarehouseIcon, TruckIcon } from '../ui/icon'
import { HeaderOne, HeaderThree } from '../ui/header'
import { DivIconInfo } from '../ui/div'
import Link from 'next/link'
import { StyledLink } from '../ui/link'

export function HouseListing({ houseData }) {
  return (
    <main>
      <HeaderOne>Houses</HeaderOne>
      { houseData?.length > 0 ? houseData.map(({ house_id, house_address, house_food, house_wood, house_people }) => (
        <StyledLink href={`/house/${house_id}`}>
          <HeaderThree>{house_address.house_address_number + " " + house_address.house_address_road.house_road_name}</HeaderThree>
          <div className="grid grid-cols-3">
            <DivIconInfo iconType="UsersIcon">{house_people.length + " people"}</DivIconInfo>
            <DivIconInfo iconType="HandPlatterIcon">{house_food.resource_volume + " Food"}</DivIconInfo>
            <DivIconInfo iconType="TreesIcon">{house_wood.resource_volume + " Wood"}</DivIconInfo>
          </div>
        </StyledLink>
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
        <DivIconInfo iconType="BedIcon">{houseData.house_rooms + " Bed"}</DivIconInfo>
        <DivIconInfo iconType="UsersIcon">{houseData.house_people.length + " people"}</DivIconInfo>
        <DivIconInfo iconType="BuildingIcon">{houseData.house_rooms - houseData.house_people.length + " Room"}</DivIconInfo>
        <DivIconInfo iconType="HandPlatterIcon">{houseData.house_food.resource_volume + " Food"}</DivIconInfo>
        <DivIconInfo iconType="TreesIcon">{houseData.house_wood.resource_volume + " Wood"}</DivIconInfo>
        <DivIconInfo iconType="TruckIcon">0 Trade</DivIconInfo>
        <DivIconInfo iconType="WarehouseIcon">{houseData.house_storage + " Storage"}</DivIconInfo>
        <DivIconInfo iconType="BoxIcon">{(houseData.house_storage - houseData.house_food.resource_volume - houseData.house_wood.resource_volume) + " Capacity"}</DivIconInfo>
      </div>
    </main>
  )
}