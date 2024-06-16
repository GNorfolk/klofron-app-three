import Link from 'next/link'
import { BriefcaseIcon, MapPinIcon } from '../ui/icon'

export function PersonListing({ personData, familyName = null }) {
  return (
    <main>
      <h2 className="p-6 text-4xl">People</h2>
      { personData.length > 0 ? personData.map(({ person_id, person_name, person_family, person_actions, person_house }) => (
        <a href={`/person/${person_id}`} className="p-6 pt-2 pb-2">
          <h3 className="text-xl font-semibold">{person_name} {familyName ? familyName : person_family.family_name}</h3>
          <div className="flex">
            <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
              <BriefcaseIcon className="w-5 h-5 mr-2" />
              <span>{person_actions.length} Current Action</span>
            </div>
            <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <MapPinIcon className="w-5 h-5 mr-2" />
              <span>{person_house.house_address.house_address_number} {person_house.house_address.house_address_road.house_road_name}</span>
            </div>
          </div>
        </a>
      )) :
        <a className="p-6 pt-2 pb-2">
          <h3 className="text-xl font-semibold">There are no people to show!</h3>
        </a>
      }
    </main>
  )
}