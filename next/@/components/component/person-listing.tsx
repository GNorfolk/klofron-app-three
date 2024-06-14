import Link from 'next/link'
import { BriefcaseIcon, HandPlatterIcon, TreesIcon } from '../ui/icon'

export function PersonListing({ personData, familyName = null }) {
  return (
    <main>
      <h2 className="p-6 text-4xl">People</h2>
      { personData.length > 0 ? personData.map(({ person_id, person_name, person_family, person_actions, person_food, person_wood }) => (
        <a href={`/person/${person_id}`} className="p-6 pt-2 pb-2">
          <h3 className="text-xl font-semibold">{person_name} {familyName ? familyName : person_family.family_name}</h3>
          <div className="flex">
            <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
              <BriefcaseIcon className="w-5 h-5 mr-2" />
              <span>{person_actions.length} Action in progress</span>
            </div>
            <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
              <HandPlatterIcon className="w-5 h-5 mr-2" />
              <span>{person_food.resource_volume} Food</span>
            </div>
            <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <TreesIcon className="w-5 h-5 mr-2" />
              <span>{person_wood.resource_volume} Wood</span>
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