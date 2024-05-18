import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'

export default function ListPersonProposals({ data, showLink = true, queryClient = null, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const createProposal = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal', {
          proposal_person_id: id
        })
      },
    })

    return (
      <div>
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <ul className={styles.list}>
          {
            data.person_proposals.length > 0 ?
              data.person_proposals.map(({ proposal_id, proposal_offers }) => (
                <li className={styles.listItem} key={data.proposal_id}>
                  <p>{data.person_name} has an existing proposal with id {proposal_id}.</p>
                  {
                    proposal_offers.map(({ proposal_offer_person, proposal_offer_dowry }) => (
                      <p>
                        Person with proposal is {data.person_name} who is {data.person_gender} and is {data.person_age} years old.
                        Person {data.person_name} will be betrothed to {proposal_offer_person.person_name} who is {proposal_offer_person.person_gender} and {proposal_offer_person.person_age} years old. 
                        They are also offering {proposal_offer_dowry.proposal_dowry_person.person_name} who is {proposal_offer_dowry.proposal_dowry_person.person_gender} and {proposal_offer_dowry.proposal_dowry_person.person_age} years old.
                      </p>
                    ))
                  }
                </li>
              ))
            :
              <div>
                <p>{data.person_name} is not open to proposal offers!</p>
                {
                  data.person_family.family_user_id === userId ?
                    <button onClick={
                      () => {
                          createProposal.mutate(data.person_id, { onSettled: (res) => {
                            queryClient.invalidateQueries()
                          }
                        })
                      }
                    }>Create Proposal</button>
                  :
                    null
                }
              </div>
          }
        </ul>
        {
          showLink ? <p>Go to <Link href={`/person/${router.query.id}/proposal`}>Proposals</Link> page.</p> : null
        }
      </div>
    )
  }
}