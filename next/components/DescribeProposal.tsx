import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"

export default function DescribeProposal({ queryClient, userId, manageOffer }) {
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
            <p>This proposal has no proposal offers.</p>
        }
        {
          manageOffer ? <ManagePersonProposalOffer userId={userId} queryClient={queryClient} /> : null
        }
      </div>
    )
  }
}

function ManagePersonProposalOffer({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['ManagePersonProposalOfferData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + router.query.person_id).then(
          (res) => res.json(),
        ),
    })

    type Inputs = {
      proposal_offer_person_id: number
    }

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (formData) => {
      axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal-offer', {
        proposal_offer_person_id: router.query.person_id,
        proposal_offer_proposal_id: router.query.proposal_id,
        proposal_dowry_person_id: formData.proposal_offer_person_id
      }).then(response => {
        queryClient.invalidateQueries()
        document.getElementById("cm-" + router.query.person_id).innerText = ' '
      }).catch(error => {
        document.getElementById("cm-" + router.query.person_id).innerText = error.response.data.message
      })
    }

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Proposal Offer</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    const familyBachelors = data.person_family.family_people.filter(ppl =>
      ppl.person_age >= 18 && ppl.person_partner_id === null && ppl.person_id != router.query.person_id
    )

    return (
      <div>
        <h2 className={styles.headingLg}>Proposal Offer</h2>
        {
          familyBachelors.length > 0 ?
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <select {...register("proposal_offer_person_id", { required: true })}>
                {
                  errors.proposal_offer_person_id ? document.getElementById("cm-" + router.query.person_id).innerText = "The Person field is required" : null
                }
                {
                  familyBachelors.map(({ person_id, person_name }) => (
                    <option value={person_id}>{person_name}</option>
                  ))
                }
                </select>
                <input type="submit" />
              </form>
              <small className={styles.lightText} id={'cm-' + router.query.person_id}></small>
            </div>
          :
            <p>No family people are eligible to betrothe!</p>
        }
      </div>
    )
  }
}