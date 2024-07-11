import Link from 'next/link'
import { UsersIcon, HomeIcon } from '../ui/icon'

export function FamilyListing({ familyData }) {
  return (
    <main>
      <h2 className="p-6 text-4xl">Families</h2>
      { familyData.length > 0 ? familyData.map(({ family_id, family_name, family_people, family_houses }) => (
        <a href={`/family/${family_id}`} className="p-6 pt-2 pb-2">
          <h3 className="text-xl font-semibold">The {family_name} family</h3>
          <div className="grid grid-cols-2">
            <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
              <UsersIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
              <span className='whitespace-nowrap'>{family_people.length} people</span>
            </div>
            <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <HomeIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
              <span className='whitespace-nowrap'>{family_houses.length} houses</span>
            </div>
          </div>
        </a>
      )) :
        <a className="p-6 pt-2 pb-2">
          <h3 className="text-xl font-semibold">The user has no families!</h3>
        </a>
      }
    </main>
  )
}