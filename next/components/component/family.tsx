import Link from 'next/link'
import { UsersIcon, HomeIcon } from '../ui/icon'
import { HeaderOne, HeaderThree } from '../ui/header'
import { DivIconInfo } from '../ui/div'

export function FamilyListing({ familyData }) {
  return (
    <main>
      <HeaderOne>Families</HeaderOne>
      { familyData.length > 0 ? familyData.map(({ family_id, family_name, family_people, family_houses }) => (
        <Link href={`/family/${family_id}`}>
          <a className="p-6 pt-2 pb-2">
            <HeaderThree>{"The " + family_name + " family"}</HeaderThree>
            <div className="grid grid-cols-2">
              <DivIconInfo>
                <UsersIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                <span className='whitespace-nowrap'>{family_people.length} people</span>
              </DivIconInfo>
              <DivIconInfo>
                <HomeIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                <span className='whitespace-nowrap'>{family_houses.length} houses</span>
              </DivIconInfo>
            </div>
          </a>
        </Link>
      )) :
        <a className="p-6 pt-2 pb-2">
          <HeaderThree>The user has no families!</HeaderThree>
        </a>
      }
    </main>
  )
}