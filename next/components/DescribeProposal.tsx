import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"

export default function DescribeProposal({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['DescribeProposalData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal/' + router.query.proposal_id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <p>{data.proposal_person.person_name} is {data.proposal_person.person_age} years old.</p>
        <h2 className={styles.headingLg}>List Proposal Offers</h2>
        {
          data.proposal_offers.length > 0 ?
            data.proposal_offers.map(({ proposal_offer_person, proposal_offer_dowry }) => (
              <div>
                <p>
                  Person with proposal is {data.proposal_person.person_name} who is {data.proposal_person.person_gender} and is {data.proposal_person.person_age} years old.
                  Person {data.proposal_person.person_name} will be betrothed to {proposal_offer_person.person_name} who is {proposal_offer_person.person_gender} and {proposal_offer_person.person_age} years old. 
                  They are also offering {proposal_offer_dowry.proposal_dowry_person.person_name} who is {proposal_offer_dowry.proposal_dowry_person.person_gender} and {proposal_offer_dowry.proposal_dowry_person.person_age} years old.
                </p>
              </div>
            ))
          :
            <p>This family have no proposal offers.</p>
        }
      </div>
    )
  }
}