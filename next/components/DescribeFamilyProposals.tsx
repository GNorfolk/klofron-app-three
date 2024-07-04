import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { BoxLayoutSingle } from '../@/components/component/box-layout-single'
import { Container } from '../@/components/component/container'
import { Button } from "../@/components/ui/button"
import { ChurchIcon } from "../@/components/ui/icon"
import { ProposalListingTwo } from '../@/components/component/proposal-listing'

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
        <BoxLayoutSingle>
          <Container>
            <h2 className="text-2xl leading-snug my-4 mx-0">Proposal Info</h2>
            {
              familyProposals.length > 0 ?
                familyProposals.map(({ person_id, person_name, person_proposals }) => (
                  <a href={"/person/" + person_id + "/proposal"} className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                    <ChurchIcon className="w-5 h-5 mr-2" />
                    <span className='whitespace-nowrap'>{person_name} has proposal {person_proposals[0].proposal_id}</span>
                  </a>
                ))
              :
                <p>No proposals!</p>
            }
          </Container>
          {/* <Container>
            <ProposalListingTwo proposalData={familyProposals} />
          </Container> */}
          <Container>
            <h2 className="text-2xl leading-snug my-4 mx-0">Manage Proposals</h2>
            {
              familyBachelors.length > 0 ?
                <div>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <select {...register("proposal_person_id", { required: true })} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                        { errors.proposal_person_id ? document.getElementById("cm-" + router.query.id).innerText = "The Person field is required" : null }
                        {
                          familyBachelors.map(({ person_id, person_name }) => (
                            <option value={person_id}>{person_name}</option>
                          ))
                        }
                      </select>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 border-2 hover:text-gray-800 m-1 transition-colors"
                        >Open to Proposals</Button>
                    </div>
                  </form>
                  <small className="text-stone-500" id={'cm-' + router.query.id}></small>
                </div>
              :
                <p className="m-2 text-gray-500 dark:text-gray-400">No eligible bachelors!</p>
            }
          </Container>
          <Container>
            <h2 className="text-2xl leading-snug my-4 mx-0">List Proposal Offers</h2>
            {
              familyProposalOffers.length > 0 ?
                familyProposalOffers.map(({ person_proposals, person_id, person_name, person_gender, person_age }) => (
                  person_proposals.map(({ proposal_offers }) => (
                    proposal_offers.map(({ proposal_offer_person, proposal_offer_dowry }) => (
                      <div>
                        <p className="m-2 text-gray-500 dark:text-gray-400">
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
                <p className="m-2 text-gray-500 dark:text-gray-400">This family have received no proposal offers.</p>
            }
          </Container>
        </BoxLayoutSingle>
      )
    } else {
      router.push('/')
    }
  }
}