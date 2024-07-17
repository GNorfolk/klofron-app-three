import { ChurchIcon } from '../ui/icon'

export function BetrothalInfo({ personInfo }) {
  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Info</h2>
        <a href={"/person/" + personInfo.person_id + "/betrothal"} className="p-6 pt-2 pb-2">
          <div className="flex">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ChurchIcon className="w-5 h-5 min-w-5 min-h-5 mx-2" />
              <span className='whitespace-nowrap'>{personInfo.person_name} has {personInfo.person_betrothal_receipts.length} betrothals.</span>
            </div>
          </div>
        </a>
    </main>
  )
}

export function BetrothalListing({ familyPeople, accepterId = null }) {
  const familyPeopleBetrothals = familyPeople.filter(ppl => ppl.person_betrothal_receipts.length > 0)
  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Info</h2>
      { familyPeopleBetrothals.length > 0 ? familyPeopleBetrothals.map(({ person_id, person_name, person_betrothal_receipts }) => (
        <a href={"/person/" + person_id + "/betrothal"} className="p-6 pt-2 pb-2">
          <div className="flex">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ChurchIcon className="w-5 h-5 min-w-5 min-h-5 mx-2" />
              <span className='whitespace-nowrap'>{person_name} has {person_betrothal_receipts.length} betrothals.</span>
            </div>
          </div>
        </a>
      )) :
      <p className="m-2 text-gray-500 dark:text-gray-400">No family members have betrothals!</p>
      }
    </main>
  )
}

export function BetrothalEligibleListing({ familyPeople, accepterId = null }) {
  const familyPeopleBachelors = familyPeople.filter(ppl => ppl.person_age >= 18 && ppl.person_partner_id === null)
  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Eligible Info</h2>
      { familyPeopleBachelors.length > 0 ? familyPeopleBachelors.map(({ person_id, person_name, person_betrothal_receipts }) => (
        <a href={"/person/" + person_id + "/betrothal"} className="p-6 pt-2 pb-2">
          <div className="flex">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ChurchIcon className="w-5 h-5 min-w-5 min-h-5 mx-2" />
              <span className='whitespace-nowrap'>{person_name} is eligible for betrothal.</span>
            </div>
          </div>
        </a>
      )) :
      <p className="m-2 text-gray-500 dark:text-gray-400">No family members are eligible for betrothal!</p>
      }
    </main>
  )
}

export function BetrothalCreation({ peopleData }) {
  const bachelors = peopleData.filter(
    ppl => ppl.person_age >= 18 && ppl.person_partner_id === null
  )
  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Eligible Info</h2>
      { bachelors.length > 0 ? bachelors.map(({ person_id, person_name, person_family, person_gender, person_age }) => (
        <a href={"/person/" + person_id} className="p-6 pt-2 pb-2">
          <div className="flex">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ChurchIcon className="w-5 h-5 min-w-5 min-h-5 mx-2" />
              <span className='whitespace-nowrap'>{person_name} {person_family.family_name} is {person_gender} and {person_age} years old.</span>
            </div>
          </div>
        </a>
      )) :
      <p className="m-2 text-gray-500 dark:text-gray-400">Nobody is eligible for betrothal!</p>
      }
    </main>
  )
}