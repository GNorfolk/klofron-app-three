import Link from 'next/link'
import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'

export default function DescribeFamilyProposals({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyProposalData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    type Inputs = {
      proposal_person_id: number
    }

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (formData) => {
      axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal', {
        proposal_person_id: formData.proposal_person_id
      }).then(response => {
        queryClient.invalidateQueries()
        document.getElementById("cm-" + router.query.id).innerText = ' '
      }).catch(error => {
        document.getElementById("cm-" + router.query.id).innerText = error.response.data.message
      })
    }

    if (isLoading) return (
      <div>
        <h2 className="text-2xl leading-snug my-4 mx-0">Proposal Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    const familyBachelors = data.family_people.filter(ppl => ppl.person_proposals.length === 0 && ppl.person_age >= 18 && ppl.person_partner_id === null)
    const familyProposals = data.family_people.filter(ppl => ppl.person_proposals.length > 0)
    const familyProposalOffers = familyProposals.filter(ppl => ppl.person_proposals.filter(prop => prop.proposal_offers.length > 0).length > 0)

    if (data.family_user_id === userId) {
      return (
        <div>
          <h2 className="text-2xl leading-snug my-4 mx-0">Proposal Info</h2>
          {
            familyProposals.length > 0 ?
              familyProposals.map(({ person_id, person_name, person_proposals }) => (
                <div>
                  <p>{person_name} has proposal <Link href={"/person/" + person_id + "/proposal"}>{person_proposals[0].proposal_id}</Link></p>
                </div>
              ))
            :
              <p>No proposals!</p>
          }
          <h2 className="text-2xl leading-snug my-4 mx-0">Manage Proposals</h2>
          {
            familyBachelors.length > 0 ?
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <select {...register("proposal_person_id", { required: true })}>
                    { errors.proposal_person_id ? document.getElementById("cm-" + router.query.id).innerText = "The Person field is required" : null }
                    {
                      familyBachelors.map(({ person_id, person_name }) => (
                        <option value={person_id}>{person_name}</option>
                      ))
                    }
                  </select>
                  <input type="submit" />
                </form>
                <small className={styles.lightText} id={'cm-' + router.query.id}></small>
              </div>
            :
              <p>No eligible bachelors!</p>
          }
          <h2 className="text-2xl leading-snug my-4 mx-0">List Proposal Offers</h2>
          {
            familyProposalOffers.length > 0 ?
              familyProposalOffers.map(({ person_proposals, person_id, person_name, person_gender, person_age }) => (
                person_proposals.map(({ proposal_offers }) => (
                  proposal_offers.map(({ proposal_offer_person, proposal_offer_dowry }) => (
                    <div>
                      <p>
                        Person with proposal is {person_name} who is {person_gender} and is {person_age} years old.
                        Person {person_name} will be betrothed to {proposal_offer_person.person_name} who is {proposal_offer_person.person_gender} and {proposal_offer_person.person_age} years old. 
                        They are also offering {proposal_offer_dowry.proposal_dowry_person.person_name} who is {proposal_offer_dowry.proposal_dowry_person.person_gender} and {proposal_offer_dowry.proposal_dowry_person.person_age} years old.
                        Goto <Link href={"/person/" + person_id + "/proposal"}>proposal</Link>.
                      </p>
                    </div>
                  ))
                ))
              ))
            :
              <p>This family have received no proposal offers.</p>
          }
        </div>
      )
    } else {
      router.push('/')
    }
  }
}