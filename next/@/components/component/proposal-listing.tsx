import Link from 'next/link'
import { ChurchIcon, HandPlatterIcon, TreesIcon } from '../ui/icon'

export function ProposalListingOne({ proposalData, accepterId = null }) {
  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">Proposal Info One</h2>
      { proposalData.length > 0 ? proposalData.map(({ proposal_id, proposal_person_id, proposal_person, proposal_offers }) => (
        <a href={accepterId != null ? "/person/" + accepterId + "/proposal/" + proposal_id : "/person/" + proposal_person_id} className="p-6 pt-2 pb-2">
          <div className="flex">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ChurchIcon className="w-5 h-5 mx-2" />
              <span className='whitespace-nowrap'>{proposal_person.person_name + " " + proposal_person.person_family.family_name + " is open to proposals."}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ChurchIcon className="w-5 h-5 mx-2" />
              <span className='whitespace-nowrap'>They have {proposal_offers.length} offers.</span>
            </div>
          </div>
        </a>
      )) :
        <p className="m-2 text-gray-500 dark:text-gray-400">No eligible proposals!</p>
      }
    </main>
  )
}

export function ProposalListingTwo({ proposalData, accepterId = null }) {
  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">Proposal Info Two</h2>
      { proposalData.length > 0 ? proposalData.map(({ person_id, person_name, person_proposals }) => (
        <a href={"/person/" + person_id + "/proposal"} className="">
          <div className="flex">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ChurchIcon className="w-5 h-5 mx-2" />
              <span className='whitespace-nowrap'>{person_name} is open to proposals.</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ChurchIcon className="w-5 h-5 mx-2" />
              <span className='whitespace-nowrap'>They have {person_proposals.length} proposals (not offers).</span>
            </div>
          </div>
        </a>
      )) :
      <p className="m-2 text-gray-500 dark:text-gray-400">No eligible proposals!</p>
      }
    </main>
  )
}